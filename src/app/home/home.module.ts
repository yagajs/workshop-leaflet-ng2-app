import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { YagaModule } from '@yaga/leaflet-ng2';

import { HomePage } from './home.page';
import { FlightRadarService } from '../flight-radar.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YagaModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  providers: [
    FlightRadarService,
  ]
})
export class HomePageModule {}
