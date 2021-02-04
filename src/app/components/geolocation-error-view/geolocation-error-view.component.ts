import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { resolve } from 'url';

@Component({
  selector: 'app-geolocation-error-view',
  templateUrl: './geolocation-error-view.component.html',
  styleUrls: ['./geolocation-error-view.component.css']
})
export class GeolocationErrorViewComponent implements OnInit {

  languageEN: boolean;
  geoLoc:boolean = true;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLanguage();
  }

  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
    }else{
      this.languageEN = true;
    }
  }

  goToMadridMobility(){
    this.fetchCoordinates();
  }

  getCoordinates() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async fetchCoordinates() {
    const position = await this.getCoordinates()
    .then(resolve =>{this.geoLoc = true;this.router.navigate(['map'])})
      .catch(err => {this.geoLoc=false});
  }

}
