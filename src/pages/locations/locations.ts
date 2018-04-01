import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationsProvider, Location, LocationList } from '../../providers/locations/locations';

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  locations: LocationList[];
  model: Location;
  key: string;
  public currentLat: any;
  public currentLng: any;
  public startCamera: any;
  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA, //Source is camera
    allowEdit: false, // Allow user to edit before saving
    mediaType: this.camera.MediaType.PICTURE,
    encodingType: this.camera.EncodingType.JPEG, // Save as JPEG
    targetWidth: 300,
    targetHeight: 300,
    saveToPhotoAlbum: true, // Album save opton
    correctOrientation: true // Camera orientation  
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
    private camera: Camera, private locationsProvider: LocationsProvider,
    private toast: ToastController) {
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
        this.locations.reverse();
        this.createNewLocation();
      });
  }

  createNewLocation() {
    if(!this.model) {
      this.model = new Location();
      this.catchLocation();
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
      //this.model.photo = 'data:image/png;base64,' + imageData;
      this.model.photo = imageData;
     }).catch((error) => {
      console.log('Error on taking photo', error);
      this.toast.create({ message: 'Falhou ao acionar a camera de seu dispositivo.', duration: 1500, position: 'botton' }).present();
     });
  }

  prepareHeader(img) {
    if(img.startsWith('file')) {
      return img;
    }else{
      return 'data:image/png;base64,'+img;
    }
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
      this.toast.create({ message: 'Falhou ao capturar sua localização.', duration: 1500, position: 'botton' }).present();
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
    return this.locationsProvider.insert(this.model);
  }

  public sendDataToServer(item: LocationList) {
    
    if(item == undefined) {
      let l = this.locations.length;
      for (let i=0;i<l;i++) {
        if(!this.locations[i].location.send) {
          this.sendToServer(this.locations[i].location, this.locations[i].key);
        }
      }
    }else{
      this.sendToServer(item.location, item.key);
    }
    
  }

  private sendToServer(location: Location, key: string) {
    this.locationsProvider.sendToServer(location)
      .then(() => {
        location.send=true;
        this.locationsProvider.update(key, location);
        this.toast.create({ message: 'Upload com sucesso.', duration: 1500, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao enviar dados.', duration: 1500, position: 'botton' }).present();
      });
  }
}
