import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationsPage } from '../locations/locations';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  map: any;
  markers: any;
  watchLocation: any;
  currentLocation: any;
  currentCoords: any;
  public btColor: string = '#c0c0c0';
  
  constructor(private alertCtrl: AlertController,
              public navCtrl: NavController, public geolocation: Geolocation) {
    this.markers = [];
    this.currentCoords = {'lat':0, 'lng':0};
  }

  goToLocations() {
    if (this.markers.length) {
      let l = this.markers.length;
      this.navCtrl.push(LocationsPage, {
        currentLat: this.markers[l-1].getPosition().lat(),
        currentLng: this.markers[l-1].getPosition().lng(),
        startCamera: true
      });
    }
  }

  useCurrentCoords() {
    this.navCtrl.push(LocationsPage, {
      currentLat: this.currentCoords.lat,
      currentLng: this.currentCoords.lng,
      startCamera: false
    });
  }

  setCurrentCoords(lat, lng) {
    this.currentCoords.lat=lat;
    this.currentCoords.lng=lng;
  }

  /* Initialize the map only when Ion View is loaded */
  ionViewDidLoad(){
    this.initializeMap();
    this.addLocation();
  }

  /*
  * This function will create and show a marker representing your location
  */
  showMyLocation(position){
  
    let newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.setCenter(newPosition);
    this.map.setZoom(15);
    
    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: newPosition,
        draggable: true
    });

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      let lat = marker.getPosition().lat();
      let lng = marker.getPosition().lng();

      let markerInfo = '<h6>Latitude:'+lat.toFixed(4)+'</h6>'+
      '<h6>Longitude:'+lng.toFixed(4)+'</h6><input type="button" value="Usar este local" '+
      'onclick="document.getElementById(\'infowindowhidden\').click()" />';

      let infoModal = new google.maps.InfoWindow({
          content: markerInfo
      });
      
      infoModal.open(this.map, marker);

      this.setCurrentCoords(lat, lng);
    });

    // google.maps.event.addListener(marker, 'drag', () => {
    //   this.resetMarkerPosition(marker);
    // });
    
    // google.maps.event.addListener(marker, 'dragend', () => {
    //   this.resetMarkerPosition(marker);
    // });
  }

  // resetMarkerPosition(marker) {
    
  // }

  initializeMap() {

    let demoCenter = new google.maps.LatLng(-23,-45);

    let options = {
      center: demoCenter,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      scaleControl: false,
      streetViewControl: false
    }

    /* Show demo location */
    this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
  }

  addLocation() {
  
    let locationOptions = {timeout: 10000, enableHighAccuracy: true};

    this.geolocation.getCurrentPosition(locationOptions).then((position) => {

        /* We can show our location only if map was previously initialized */
        this.showMyLocation(position);

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

  startWatchingLocation() {

    this.stopWatchingLocation();

    if(this.watchLocation == undefined) {
      this.watchLocation = this.geolocation.watchPosition().subscribe(position => {
        if (position != undefined) {
          this.btColor = '#00ff00';// on
          let newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(newPosition);
          this.map.setZoom(15);
          
          if (this.currentLocation != undefined) {
            this.currentLocation.setMap(null);
          }

          this.currentLocation = new google.maps.Marker({
              map: this.map,
              position: newPosition,
              icon: {
                url: "./assets/imgs/marker25x25.png",
                size: {
                width: 25,
                height: 25
              }
            }
          });
        }
      });
    }
  }

  stopWatchingLocation() {
    // To stop notifications
    if (this.currentLocation != undefined) {
      this.btColor = '#c0c0c0';// off
      this.currentLocation.setMap(null);
      this.watchLocation.unsubscribe();
    }else{
      this.btColor = '#FFFF00'; // try on
    }
  }

  removeLastLocation() {
    let m = this.markers.pop();
    if(m != undefined)
      m.setMap(null);
  }

  clearMarkers() {
    while(this.markers.length) {
      this.removeLastLocation();
    }
  }

}
