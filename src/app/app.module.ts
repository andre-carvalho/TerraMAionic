import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Base64 } from '@ionic-native/base64/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from '../app-routing.module';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LocationsProvider } from '../providers/locations/locations';
import { JwtTokenAuthProvider } from '../providers/jwt-token-auth/jwt-token-auth';
import { JwtTokenAuthGuardProvider } from '../providers/jwt-token-auth-guard/jwt-token-auth-guard';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:5000']
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__terramadb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    Geolocation,
    DatePipe,
    LocationsProvider,
    Base64,
    JwtTokenAuthProvider,
    JwtTokenAuthGuardProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
