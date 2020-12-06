import { Component, OnInit } from '@angular/core';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
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

  constructor(private styleService: StyleService, private bikesLayerService: BikesLayerService) { }

  ngOnInit(): void {
  }

  setBikeOrDot(bikeOrDot: string){
    
    //@ts-ignore
    if(bikeOrDot.checked){
      this.bikesOrSlots='slots';
      this.bikesLayerService.createBikeStationsFeatures('slots')
    }else{
      this.bikesOrSlots='bikes';
      this.bikesLayerService.createBikeStationsFeatures('bikes')
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
