import { Cluster } from "./cluster";

export abstract class Renderer {
  abstract render(cluster: Cluster): google.maps.Marker;
}

export class NoopRenderer extends Renderer {
  render({ markers, position, map }: Cluster): google.maps.Marker {
    let marker: google.maps.Marker;

    if (markers.length > 1) {
      marker = new google.maps.Marker({
        position,
        label: String(markers.length),
      });
    } else {
      marker = markers[0];
    }

    marker.setMap(map);
    return marker;
  }
}
