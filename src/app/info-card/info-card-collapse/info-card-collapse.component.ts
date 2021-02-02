import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-card-collapse',
  templateUrl: './info-card-collapse.component.html',
  styleUrls: ['./info-card-collapse.component.css']
})
export class InfoCardCollapseComponent implements OnInit {

  showMenu:boolean=true;

  languageEN: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  showHideMenu(){
    if(this.showMenu){
      this.showMenu=false
    }else{
      this.showMenu=true;
    }
  }

  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
    }else{
      this.languageEN = true;
    }
  }

}
