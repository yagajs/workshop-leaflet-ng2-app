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

  public debug = true;
  public pickerLat = 51.03522;
  public pickerLng = 13.73427;

  public airports = [
    {lat: 50.865916666667, lng: 7.1427444444444, title: 'Cologne', description: 'Start of travel'},
    {lat: 51.134344444444, lng: 13.768, title: 'Dresden', description: 'This is my Destination'},
  ];

  ionViewWillEnter() {
    this.mapComponent.invalidateSize();
  }
}
