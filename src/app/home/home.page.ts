import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '@yaga/leaflet-ng2';

import { FlightRadarService, IFlightData } from '../flight-radar.service';

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

  public aircrafts: IFlightData[] = [];

  constructor(private flightRadar: FlightRadarService) {}

  public airports = [
    {lat: 50.865916666667, lng: 7.1427444444444, title: 'Cologne', description: 'Start of travel'},
    {lat: 51.134344444444, lng: 13.768, title: 'Dresden', description: 'This is my Destination'},
  ];

  ionViewWillEnter() {
    this.mapComponent.invalidateSize();
    this.flightRadar.setBoundingBox(this.mapComponent.getBounds());
    this.flightRadar.observable.subscribe((data) => this.aircrafts = data);
    this.flightRadar.start();
  }
  ionViewWillLeave() {
    this.flightRadar.stop();
  }

  refreshBoundingBox() {
    this.flightRadar.setBoundingBox(this.mapComponent.getBounds());
  }

  calcRadius(aircraft: IFlightData) {
    return aircraft.velocity * 10;
  }
  calcColor(aircraft: IFlightData) {
    if (aircraft.on_ground) {
      return 'green';
    }
    if (aircraft.vertical_rate > 7) {
      return 'yellow';
    }
    if (aircraft.vertical_rate < -7) {
      return 'red';
    }
    return 'blue';
  }
}
