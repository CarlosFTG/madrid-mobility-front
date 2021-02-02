import { Component, OnInit } from '@angular/core';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { StyleService } from 'src/app/services/style.service';
import { LegendService } from '../services/legend.service';

@Component({
  selector: 'app-bikes-legend',
  templateUrl: './bikes-legend.component.html',
  styleUrls: ['./bikes-legend.component.css']
})
export class BikesLegendComponent implements OnInit {

  constructor(private styleService: StyleService, private bikesLayerService: BikesLayerService, private legendService: LegendService) { }

  bikesOrSlots:string ;
  checked = false;
  disabled = false;

  languageEN: boolean;

  ngOnInit(): void {
    this.getLanguage();
  }

  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
      this.bikesOrSlots = 'Bicis';
    }else{
      this.languageEN = true;
      this.bikesOrSlots = 'Bikes';
    }
  }

  setBikeOrDot(bikeOrDot: string){
    
    //@ts-ignore
    if(bikeOrDot.checked){
      if(!this.languageEN){
        this.bikesOrSlots='huecos';
      }else{
        this.bikesOrSlots='slots';
      }
      
      this.bikesLayerService.createBikeStationsFeatures('slots');
      this.legendService.toggleChange();
    }else{
      if(!this.languageEN){
        this.bikesOrSlots='bicis';
      }else{
        this.bikesOrSlots='bikes';
      }
      this.bikesLayerService.createBikeStationsFeatures('bikes');
      this.legendService.toggleChange();
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
