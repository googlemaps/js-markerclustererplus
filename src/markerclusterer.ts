import { Algorithm, DBScan, Kmeans } from "./algorithm";
import { Cluster } from "./cluster";
import { Renderer, NoopRenderer } from "./renderer";

export class MarkerClusterer {
  protected algorithm: Algorithm;
  protected clusters: Cluster[];
  protected clusterMarkers: google.maps.Marker[];
  protected markers: google.maps.Marker[];
  protected renderer: Renderer;
  protected map: google.maps.Map | null;
  public maxZoom: number;

  constructor({
    map,
    maxZoom = 18,
    markers = [],
    algorithm = new DBScan(1000),
    renderer = new NoopRenderer(),
  }: {
    algorithm: Algorithm;
    map: google.maps.Map;
    markers: google.maps.Marker[];
    maxZoom: number;
    renderer: Renderer;
  }) {
    this.markers = markers;
    this.maxZoom = maxZoom;
    this.clusters = [];
    this.clusterMarkers = [];

    this.algorithm = algorithm;
    this.renderer = renderer;

    console.log(this.algorithm);
    console.log(this.renderer);

    if (map) {
      this.setMap(map);
    }
  }

  addMarker(marker: google.maps.Marker, noDraw?: boolean): void {
    this.markers.push(marker);
    if (!noDraw) {
      this.draw();
    }
  }

  addMarkers(markers: google.maps.Marker[], noDraw?: boolean): void {
    markers.forEach((marker) => {
      this.addMarker(marker, false);
    });

    if (!noDraw) {
      this.draw();
    }
  }

  removeMarker(marker: google.maps.Marker, noDraw?: boolean): boolean {
    const index = this.markers.indexOf(marker);

    if (index === -1) {
      // Marker is not in our list of markers, so do nothing:
      return false;
    }

    marker.setMap(null);
    this.markers.splice(index, 1); // Remove the marker from the list of managed markers

    if (!noDraw) {
      this.draw();
    }

    return true;
  }

  removeMarkers(markers: google.maps.Marker[], noDraw?: boolean): boolean {
    let removed = false;

    markers.forEach((marker) => {
      removed = removed || this.removeMarker(marker, false);
    });

    if (!noDraw) {
      this.draw();
    }

    return removed;
  }

  setMap(map?: google.maps.Map | null): void {
    this.map = map;

    google.maps.event.addListener(map, "idle", () => {
      this.draw();
    });
  }

  /**
   * Recalculates and draws all the marker clusters.
   */
  draw(): void {
    if (this.map) {
      if (this.map.getZoom() > this.maxZoom) {
        this.markers.forEach((marker) => marker.setMap(this.map));
        this.clusters.forEach(({ marker }) => marker.setMap(null));
        this.clusters = [];
      } else {
        this.markers.forEach((marker) => marker.setMap(null));

        const { clusters, changed } = this.algorithm.calculate({
          markers: this.markers,
          map: this.map,
        });

        if (changed || this.clusters.length === 0) {
          const existingClusters = this.clusters.slice(0);
          this.clusters = clusters;

          // setTimeout(() => {
          existingClusters.forEach(({ marker }) => marker.setMap(null));
          // }, 0);

          this.clusters.forEach((cluster) => {
            cluster.render(this.renderer);
          });
        }
      }
    }
  }
}
