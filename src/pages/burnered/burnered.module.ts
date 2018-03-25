import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BurneredPage } from './burnered';
import { MapPage } from '../map/map';

@NgModule({
  declarations: [
    BurneredPage,
    MapPage
  ],
  imports: [
    IonicPageModule.forChild(BurneredPage),
  ],
})
export class BurneredPageModule {}
