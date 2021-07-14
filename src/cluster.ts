import { Renderer } from "./renderer";

export interface ClusterOptions {
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  map: google.maps.Map;
  markers: google.maps.Marker[];
  /**
   * Bounds of the cluster. May not be exactly the bounds containing all markers.
   */
  bounds?: google.maps.LatLngBounds;
}

export class Cluster {
  public marker: google.maps.Marker;
  readonly position: google.maps.LatLng | google.maps.LatLngLiteral;
  public markers: google.maps.Marker[];
  readonly map: google.maps.Map;

  constructor({ map, markers, position }: ClusterOptions) {
    this.map = map;
    this.markers = markers;
    this.position = position;

    this.position = position || this.bounds.getCenter();
  }

  get bounds(): google.maps.LatLngBounds | undefined {
    if (this.markers.length === 0 && !this.position) {
      return undefined;
    }

    return this.markers.reduce((bounds, marker) => {
      return bounds.extend(marker.getPosition());
    }, new google.maps.LatLngBounds(this.position, this.position));
  }

  get center(): google.maps.LatLng {
    return this.bounds.getCenter();
  }

  render(renderer: Renderer): google.maps.Marker {
    this.marker = renderer.render(this);
    this.marker.addListener("click", this.onClick.bind(this));
    return this.marker;
  }

  onClick(): void {
    this.map.fitBounds(this.bounds);
  }
}
