import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  public base64Image: string;
  public currentLat: any;
  public currentLng: any;
  public startCamera: any;
  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    cameraDirection: 1 
  }

  constructor(private camera: Camera,  private DomSanitizer: DomSanitizer, private alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
      this.currentLat = navParams.get('currentLat');
      this.currentLng = navParams.get('currentLng');
      this.startCamera = navParams.get('startCamera');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationsPage');
    if(this.startCamera) {
      console.log('Start camera after init page...');
      this.takePicture();
    }
    if(!this.currentLat || !this.currentLng) {
      this.catchLocation()
    }
  }

  takePicture() {
    this.base64Image = undefined;

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
     }).catch((error) => {
      console.log('Error on taking photo', error);
      let alert = this.alertCtrl.create({
        title: 'Falha Camera',
        subTitle: 'Falhou ao acionar a camera de seu dispositivo. Erro informado: '+error.message,
        buttons: ['ok']
      });
      alert.present();
     });
  }

  catchLocation() {
  
    let locationOptions = {timeout: 10000, enableHighAccuracy: true};

    this.geolocation.getCurrentPosition(locationOptions).then((position) => {

      this.currentLat = position.coords.latitude;
      this.currentLng = position.coords.longitude;

    }).catch((error) => {
      console.log('Error getting location', error);
      let alert = this.alertCtrl.create({
        title: 'Falha GPS',
        subTitle: 'Falou ao capturar sua localização. Erro informado: '+error.message,
        buttons: ['ok']
      });
      alert.present();
    });
  }

  sendDataToServer() {

  }

}
