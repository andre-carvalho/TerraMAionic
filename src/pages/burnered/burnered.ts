import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map'
import { AlertController } from 'ionic-angular';
import { LocationsPage } from '../locations/locations';

@Component({
  selector: 'page-burnered',
  templateUrl: 'burnered.html',
})
export class BurneredPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BurneredPage');
  }

  goToInfo() {
    let alert = this.alertCtrl.create({
      title: 'Para informar uma ocorrência.',
      subTitle: 'Tire uma foto, capture sua localização e envie para o sistema de alertas.',
      buttons: ['ok']
    });
    alert.present();
  }

  goToMap() {
    this.navCtrl.push(MapPage);
  }
  
  goToCamera() {
    this.navCtrl.push(LocationsPage, {startCamera:true});
  }

  goToEdit() {
    this.navCtrl.push(LocationsPage);
  }

  sendDataToServer() {

  }

  goToLocations() {
    this.navCtrl.push(LocationsPage, {
      currentLat: 'não definido',
      currentLng: 'não definido',
      startCamera: true
    });
  }
}
