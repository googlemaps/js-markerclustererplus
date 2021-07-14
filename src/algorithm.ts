import { Cluster } from "./cluster";
import clustersDbscan from "@turf/clusters-dbscan";
import clustersKmeans from "@turf/clusters-kmeans";
import { Units, featureCollection, point, polygon } from "@turf/helpers";
import buffer from "@turf/buffer";

export interface AlgorithmInput {
  map: google.maps.Map;
  markers: google.maps.Marker[];
}

export interface AlgorithmOutput {
  clusters: Cluster[];
  changed: boolean;
}

export abstract class Algorithm {
  abstract calculate({ markers, map }: AlgorithmInput): AlgorithmOutput;
  abstract cluster({ markers, map }: AlgorithmInput): AlgorithmOutput;
}

export class Noop extends Algorithm {
  calculate({ markers, map }: AlgorithmInput): AlgorithmOutput {
    return this.cluster({ markers, map });
  }

  cluster({ markers, map }: AlgorithmInput): AlgorithmOutput {
    const clusters = markers.map(
      (marker) =>
        new Cluster({ position: marker.getPosition(), markers: [marker], map })
    );
    const changed = false;

    return { clusters, changed };
  }
}

export interface DBScanOptions {
  units?: Units;
  minPoints?: number;
  mutate?: boolean;
}

export const DEFAULT_DBSCAN_OPTIONS: DBScanOptions = {
  units: "kilometers",
  mutate: true,
  minPoints: 1,
};

export class DBScan extends Algorithm {
  protected maxDistance: number;
  protected options: DBScanOptions;
  constructor(
    maxDistance = 100,
    options: DBScanOptions = DEFAULT_DBSCAN_OPTIONS
  ) {
    super();
    this.maxDistance = maxDistance;
    this.options = options;
  }

  calculate({ markers, map }: AlgorithmInput): AlgorithmOutput {
    return this.cluster({ markers, map });
  }

  cluster({ markers, map }: AlgorithmInput): AlgorithmOutput {
    const points = featureCollection(
      markers.map((marker) => {
        const projectedPoint = latLngToMeters(marker.getPosition());

        return point([projectedPoint.x, projectedPoint.y]);
      })
    );

    const grouped: google.maps.Marker[][] = [];

    clustersDbscan(points, this.maxDistance, this.options).features.forEach(
      (point, i) => {
        if (!grouped[point.properties.cluster]) {
          grouped[point.properties.cluster] = [];
        }

        grouped[point.properties.cluster].push(markers[i]);
      }
    );

    const clusters = grouped.map((markers) => new Cluster({ markers, map }));
    return { clusters, changed: true };
  }
}
export interface KmeansOptions {
  numberOfClusters: number | ((count: number, zoom: number) => number);
}

export class Kmeans extends Algorithm {
  protected maxDistance: number;
  protected options: KmeansOptions;
  protected lastZoom: number;

  constructor(options: KmeansOptions = { numberOfClusters: 7 }) {
    super();
    this.options = options;
  }

  calculate({ markers, map }: AlgorithmInput): AlgorithmOutput {
    if (this.lastZoom === map.getZoom()) {
      return { clusters: [], changed: false };
    }

    this.lastZoom = map.getZoom();
    return this.cluster({ markers, map });
  }

  cluster({ markers, map }: AlgorithmInput): AlgorithmOutput {
    const points = featureCollection(
      markers.map((marker) => {
        return point([marker.getPosition().lng(), marker.getPosition().lat()]);
      })
    );

    const clusters: Cluster[] = [];

    let numberOfClusters: number;

    if (this.options.numberOfClusters instanceof Function) {
      numberOfClusters = this.options.numberOfClusters(
        markers.length,
        map.getZoom()
      );
    } else {
      numberOfClusters = this.options.numberOfClusters;
    }

    clustersKmeans(points, { numberOfClusters }).features.forEach(
      (point, i) => {
        if (!clusters[point.properties.cluster]) {
          clusters[point.properties.cluster] = new Cluster({
            map,
            position: {
              lng: point.properties.centroid[0],
              lat: point.properties.centroid[1],
            },
            markers: [markers[i]],
          });
        }

        clusters[point.properties.cluster].markers.push(markers[i]);
      }
    );

    return { clusters, changed: true };
  }
}

export class KmeansViewPort extends Kmeans {
  protected maxDistance: number;
  protected options: KmeansOptions;
  protected lastZoom: number;

  constructor(options: KmeansOptions = { numberOfClusters: 7 }) {
    super();
    this.options = options;
  }

  calculate({ markers, map }: AlgorithmInput): AlgorithmOutput {
    const bounds = map.getBounds();
    return this.cluster({
      markers: markers.filter((marker) =>
        bounds.contains(marker.getPosition())
      ),
      map,
    });
  }
}

export const EARTH_RADIUS = 6371010;
export const WORLD_SIZE = Math.PI * EARTH_RADIUS;

function toLatLngLiteral(
  latLng: google.maps.LatLngLiteral | google.maps.LatLng
): google.maps.LatLngLiteral {
  if (window.google && google.maps && latLng instanceof google.maps.LatLng) {
    return latLng.toJSON();
  }
  return latLng as google.maps.LatLngLiteral;
}

/**
 * Converts latitude and longitude to meters.
 */
export function latLngToMeters(
  latLng: google.maps.LatLngLiteral | google.maps.LatLng
): {
  x: number;
  y: number;
} {
  latLng = toLatLngLiteral(latLng);

  const x = EARTH_RADIUS * degToRad(latLng.lng);
  const y =
    0 -
    EARTH_RADIUS *
      Math.log(Math.tan(0.5 * (Math.PI * 0.5 - degToRad(latLng.lat))));
  return { x, y };
}

function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface GridOptions {
  gridSize?: number;
  /**
   * Max distance between cluster center and point in meters.
   * @default 10000
   */
  maxDistance?: number;
}

export class Grid extends Algorithm {
  gridSize = 60;
  maxDistance: number;
  clusters: Cluster[] = [];

  constructor({ maxDistance = 40000, gridSize = 60 }: GridOptions) {
    super();

    this.gridSize = gridSize;
    this.maxDistance = maxDistance;
  }
  calculate({ markers, map }: AlgorithmInput): AlgorithmOutput {
    this.clusters = [];

    const extendedMapBounds = this.getExtendedBounds(
      map.getBounds(),
      (metersPerPixel(
        new google.maps.LatLng({ lat: 0, lng: 0 }),
        map.getZoom()
      ) /
        1000) *
        this.gridSize
    );

    return this.cluster({
      markers: markers.filter((marker) =>
        extendedMapBounds.contains(marker.getPosition())
      ),
      map,
    });
  }

  cluster({ markers, map }: AlgorithmInput): AlgorithmOutput {
    markers.forEach((marker) => {
      this.addToClosestCluster(marker, map);
    });

    return { clusters: this.clusters, changed: true };
  }

  addToClosestCluster(marker: google.maps.Marker, map: google.maps.Map): void {
    let maxDistance = this.maxDistance; // Some large number
    let cluster: Cluster = null;

    for (let i = 0; i < this.clusters.length; i++) {
      const candidate = this.clusters[i];
      const distance = distanceBetweenPoints(
        candidate.center,
        marker.getPosition()
      );

      if (distance < maxDistance) {
        maxDistance = distance;
        cluster = candidate;
      }
    }

    if (
      cluster &&
      this.getExtendedBounds(
        cluster.bounds,
        (metersPerPixel(
          new google.maps.LatLng({ lat: 0, lng: 0 }),
          map.getZoom()
        ) /
          1000) *
          this.gridSize
      ).contains(marker.getPosition())
    ) {
      cluster.markers.push(marker);
    } else {
      const cluster = new Cluster({ map, markers: [marker] });
      this.clusters.push(cluster);
    }
  }
  /**
   * Returns the current bounds extended by the grid size.
   *
   * @param bounds The bounds to extend.
   * @return The extended bounds.
   * @ignore
   */
  getExtendedBounds(
    bounds: google.maps.LatLngBounds,
    distance: number
  ): google.maps.LatLngBounds {
    // convert from pixels to kilometers
    // convert bounds to geojson
    const { west, south, north, east } = bounds.toJSON();

    const buffered = buffer(
      polygon([
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ]),
      distance
    );

    const updated = new google.maps.LatLngBounds();

    buffered.geometry.coordinates[0].forEach(([lng, lat]) => {
      updated.extend(new google.maps.LatLng({ lat, lng }));
    });

    console.log({
      distance,
      updated: updated.toJSON(),
      bounds: bounds.toJSON(),
    });
    return updated;
  }
}

function distanceBetweenPoints(
  p1: google.maps.LatLng,
  p2: google.maps.LatLng
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((p2.lat() - p1.lat()) * Math.PI) / 180;
  const dLon = ((p2.lng() - p1.lng()) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat() * Math.PI) / 180) *
      Math.cos((p2.lat() * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const latLngToPixel = (
  projection: google.maps.Projection,
  latLng: google.maps.LatLng,
  zoom: number,
  bounds: google.maps.LatLngBounds
) => {
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
  const scale = Math.pow(2, zoom);

  const point = projection.fromLatLngToPoint(latLng);
  // todo handle wrapping
  if (topRight.x > bottomLeft.x) {
    throw "handle wrapping";
  }
  const x = (point.x - bottomLeft.x) * scale;
  const y = (point.y - topRight.y) * scale;

  return { x, y };
};

const pixelToLatLng = (
  projection: google.maps.Projection,
  point: google.maps.Point,
  bounds: google.maps.LatLngBounds,
  container: HTMLElement
) => {
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());

  const { height, width } = container.getBoundingClientRect();

  // todo handle wrapping
  if (topRight.x > bottomLeft.x) {
    throw "handle wrapping";
  }
  const x =
    ((width - point.x) / width) * (topRight.x - bottomLeft.x) + bottomLeft.x;
  const y =
    ((height - point.y) / height) * (topRight.y - bottomLeft.y) + bottomLeft.y;

  return projection.fromPointToLatLng(new google.maps.Point(x, y));
};

const metersPerPixel = (latLng: google.maps.LatLng, zoom: number) =>
  (156543.03392 * Math.cos((latLng.lat() * Math.PI) / 180)) / Math.pow(2, zoom);
