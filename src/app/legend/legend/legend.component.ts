import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  bikeOrDot:string = 'bikes';
  checked = false;
  disabled = false;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  setBikeOrDot(bikeOrDot: string){
    this.bikeOrDot=bikeOrDot;
  }

  toggleSlide(event){
    if(event.checked){
      this.globalService.showHeatMap();
    }else{
      this.globalService.hideHeatMap();
    }
  }

}
