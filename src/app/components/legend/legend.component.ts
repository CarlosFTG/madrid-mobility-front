import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  bikeOrDot:string = 'bikes';
  constructor() { }

  ngOnInit(): void {
  }

  setBikeOrDot(bikeOrDot: string){
    this.bikeOrDot=bikeOrDot;
  } 

}
