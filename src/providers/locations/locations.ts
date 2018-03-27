// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationsProvider {

  constructor(private storage: Storage, private datepipe: DatePipe) { //, public http: HttpClient
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
