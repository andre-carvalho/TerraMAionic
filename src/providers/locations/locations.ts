import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders } from '@angular/common/http';


/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationsProvider {

  private API_URL = 'http://192.168.1.11:5000';

  constructor(private storage: Storage, private datepipe: DatePipe, public http: HttpClient) {
    console.log('Hello LocationsProvider Provider');
  }

  public insert(location: Location) {
    let key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
    location.timeref = new Date();
    if(!location.description){
      location.description='Sem descrição.';
    }
    return this.save(key, location);
  }

  public update(key: string, location: Location) {
    return this.save(key, location);
  }

  private save(key: string, location: Location) {
    return this.storage.set(key, location);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {

    let contacts: LocationList[] = [];

    return this.storage.forEach((value: Location, key: string, iterationNumber: Number) => {
      let location = new LocationList();
      location.key = key;
      location.location = value;
      contacts.push(location);
    })
      .then(() => {
        return Promise.resolve(contacts);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public sendToServer(location: Location) {
    return this.postDataToServer(location);
  }

  private postDataToServer(location: any) {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    let url = this.API_URL + '/locations';
    
    let data = {
      'description':location.description,
      'lat':location.lat,
      'lng':location.lng,
      'datetime':location.timeref.toISOString(),
      'photo':location.photo
    }

    return new Promise((resolve, reject) => {
      this.http.post(url, data, { headers:headers })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }
}





export class Location {
  lat: number;
  lng: number;
  description: string;
  photo: string;
  timeref: Date;
}

export class LocationList {
  key: string;
  location: Location;
}
