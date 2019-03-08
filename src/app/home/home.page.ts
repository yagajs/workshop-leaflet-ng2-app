import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '@yaga/leaflet-ng2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(MapComponent) private mapComponent: MapComponent;

  public tileLayerUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
  public mapLat = 51.03522;
  public mapLng = 13.73427;
  public mapZoom = 12;

  ionViewWillEnter() {
    this.mapComponent.invalidateSize();
  }
}
