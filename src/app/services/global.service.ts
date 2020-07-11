import { Injectable } from '@angular/core';
import {MapComponent} from '../components/map/map.component'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private mapComponent : MapComponent) { }

  showHeatMap(){
    this.mapComponent.getBikeAccidents();
  }

  hideHeatMap(){
    this.mapComponent.hideHeatMap();
  }
}
