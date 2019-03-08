import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '@yaga/leaflet-ng2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(MapComponent) private mapComponent: MapComponent;

  ionViewWillEnter() {
    this.mapComponent.invalidateSize();
  }
}
