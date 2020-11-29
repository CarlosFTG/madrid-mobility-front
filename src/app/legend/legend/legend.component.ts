import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/services/style.service';
@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  bikesOrSlots:string = 'bikes';
  checked = false;
  disabled = false;

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
  }

  setBikeOrDot(bikeOrDot: string){
    
    //@ts-ignore
    if(bikeOrDot.checked){
      this.bikesOrSlots='slots';
      this.styleService.changeBikeMarkerStyle( 'slot');
    }else{
      this.bikesOrSlots='bikes';
      this.styleService.changeBikeMarkerStyle( 'bikes');
    }
  }

  // toggleSlide(event){
  //   if(event.checked){
  //     this.globalService.showHeatMap();
  //   }else{
  //     this.globalService.hideHeatMap();
  //   }
  // }

}
