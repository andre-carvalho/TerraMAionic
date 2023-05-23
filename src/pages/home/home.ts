import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BurneredPage } from '../burnered/burnered';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private router: Router) {

  }

  onSubmit() {
    if(this.login()){
      this.goToBurnered();
    }
  }

  goToBurnered() {
    this.router.navigate(['/burnered'])
  }

  private login(){
    // TODO: Implements the call to login service
    return false;
  }

}
