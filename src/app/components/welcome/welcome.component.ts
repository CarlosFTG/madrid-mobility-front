import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  languageEN: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getLanguage();
  }
navigateToMadridMobility(){
  this.router.navigate(['map']);
}

getLanguage(){
  let languageMavigator =  window.navigator.language;
  
  if(languageMavigator === 'es-ES'){
    this.languageEN = false;
  }else{
    this.languageEN = true;
  }

}
}
