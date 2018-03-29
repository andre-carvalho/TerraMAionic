import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationsProvider, Location, LocationList } from '../../providers/locations/locations';

@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  locations: LocationList[];
  model: Location;
  key: string;
  public base64Image: string;
  public currentLat: any;
  public currentLng: any;
  public startCamera: any;
  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    cameraDirection: 1 
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
    private camera: Camera,  private DomSanitizer: DomSanitizer, private alertCtrl: AlertController,
    private locationsProvider: LocationsProvider, private toast: ToastController) {
      this.currentLat = this.navParams.get('currentLat');
      this.currentLng = this.navParams.get('currentLng');
      this.startCamera = this.navParams.get('startCamera');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationsPage');
    
    this.createNewLocation();

    this.reloadLocations();

    if(this.startCamera) {
      console.log('Start camera after init page...');
      this.takePicture();
    }
    if(!this.currentLat || !this.currentLng) {
      this.catchLocation();
    }else{
      this.model.lat = +(this.currentLat).toFixed(4);
      this.model.lng = +(this.currentLng).toFixed(4);
    }
  }

  reloadLocations() {
    this.locationsProvider.getAll()
      .then((result) => {
        this.locations = result;
        this.createNewLocation()
      });
  }

  createNewLocation() {
    if(!this.model) {
      this.model = new Location();
    }
  }

  removeLocation(item: LocationList) {
    this.locationsProvider.remove(item.key)
      .then(() => {
        // removing from array of itens
        var index = this.locations.indexOf(item);
        this.locations.splice(index, 1);
        this.toast.create({ message: 'Local removido.', duration: 1500, position: 'botton' }).present();
      })
  }

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //this.model.photo = 'data:image/jpeg;base64,' + imageData;
      this.model.photo = imageData;
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

      this.model.lat = +(position.coords.latitude).toFixed(4);
      this.model.lng = +(position.coords.longitude).toFixed(4);
      this.currentLat = +(position.coords.latitude).toFixed(4);
      this.currentLng = +(position.coords.longitude).toFixed(4);

    }).catch((error) => {
      console.log('Error getting location', error);
      let alert = this.alertCtrl.create({
        title: 'Falha GPS',
        subTitle: 'Falhou ao capturar sua localização. Erro informado: '+error.message,
        buttons: ['ok']
      });
      alert.present();
    });
  }

  public save() {
    this.saveLocation()
      .then(() => {
        this.toast.create({ message: 'Local salvo.', duration: 1500, position: 'botton' }).present();
        this.model=undefined;
        this.reloadLocations();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o local.', duration: 1500, position: 'botton' }).present();
      });
  }

  private saveLocation() {
    if (this.key) {
      return this.locationsProvider.update(this.key, this.model);
    } else {
      return this.locationsProvider.insert(this.model);
    }
  }

  public sendDataToServer(item: LocationList) {
    
    this.locationsProvider.sendToServer(item.location)
      .then(() => {
        this.toast.create({ message: 'Upload com sucesso.', duration: 1500, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao enviar dados.', duration: 1500, position: 'botton' }).present();
      });
  }
}
