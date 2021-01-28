import { Injectable } from '@angular/core';

import { Style, Icon as IconStyle, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

@Injectable({
  providedIn: 'root'
})
export class StreetsStyleService {

  constructor() { }

  styleStreets(feature){
    let lineStyle = [];

    let streetsStyle = new Style({
      stroke: new Stroke({ color: 'yellow', width: 5 }),
    })
    lineStyle.push(streetsStyle);
    feature.setStyle(lineStyle);
  }
}
