import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.css']
})
export class InfoPopupComponent implements OnInit {
  totalBikes:string;
  availableSlots:string;
  name:string;
  address:string;
  updatedAt: string;
  languageEN: boolean;
  constructor() { }

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

}
