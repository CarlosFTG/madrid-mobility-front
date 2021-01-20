import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  availableBikes: number;
  freeDocks: number;
}

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
  constructor() { }

  ngOnInit(): void {
  }

}
