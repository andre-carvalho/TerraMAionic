import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { JwtTokenAuthProvider } from '../providers/jwt-token-auth/jwt-token-auth';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: JwtTokenAuthProvider,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['burnered']);
        } else {
          this.router.navigate(['login']);
        }
      });
      
    });
  }
}