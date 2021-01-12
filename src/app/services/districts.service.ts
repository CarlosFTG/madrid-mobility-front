import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as olProj from 'ol/proj';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon as IconStyle, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

import { MapService } from './map.service';
import { StyleService } from './style.service';
import { BikesLayerService } from './bikes-layer.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {

  response: any;
  districtsFeaturesCollection = new Collection;
  
  constructor(private httpClient: HttpClient, private mapService: MapService, private styleService: StyleService, private bikesService: BikesLayerService) {
    
    this.bikesService.bikes$.subscribe(bikes=>{
      if(bikes ){
        this.getDistricts()
      }
      
    })
  }

  getDistricts() {
    //this.httpClient.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/getDistricts').subscribe(
      this.httpClient.get('http://localhost:8081/api/EMTServices/getDistricts').subscribe(
      res => {
        this.response = res;
        this.createDistrictsFeatures()
      },
      err=>{
        console.log(err)
      }
    )
  }

  createDistrictsFeatures() {

    let totalBikes = 0;
    let districtsArrayCoords = new Array;
    let districtsArrayInfo = new Array;

    
    for (let i = 0; i < this.response.length; i++) {
      let pair = this.response[i].geom.substring(16, this.response[i].geom.length - 3).split(',')
      let coordsDistrictArray = new Array;
      let districtObj = {
        'totalBikes':null,
        'districtName':null
      }
    
      for (let j = 0; j < pair.length; j++) {
        let coordsPair = new Array;
        pair[j].trim();
        let split = pair[j].trim().split(' ')
        let lat = split[0]
        let lng = split[1]
        coordsPair.push(parseFloat(lat));
        coordsPair.push(parseFloat(lng));
        coordsDistrictArray.push(coordsPair);
      }
      districtsArrayCoords.push(coordsDistrictArray)
      districtObj.totalBikes = this.response[i].totalBikes;
      districtObj.districtName = this.response[i].name;
      districtsArrayInfo.push(districtObj)
    }
    for (let i = 0; i < districtsArrayCoords.length; i++) {
      //for(let j = 0; j < districtsArrayCoords[i].length; j++){
        let coorsTranform = districtsArrayCoords[i].map((coordinate) => {
          return olProj.transform([coordinate[0], coordinate[1]], 'EPSG:4326', 'EPSG:3857');
        });
        let feature = new Feature({
  
          geometry: new Polygon([
            coorsTranform
          ])
        });
  
        feature.setProperties({'totalBikes':districtsArrayInfo[i]})
  
         this.styleService.applyStyleToDistricts(feature);
        // feature.setId(coordsArray[i].name);
    
        this.districtsFeaturesCollection.push(feature)
     // }
      
    }

    let districtsLayer = new VectorLayer({
			name: 'districts',
			source: new VectorSource({
				features: this.districtsFeaturesCollection
			})
    })
    this.mapService.map$.addLayer(districtsLayer);
  }

  applyStyleToDistrict(feature){

    let plots_styles = [];

    plots_styles.push(

      new Style({
        fill: new Fill({
          color: [255, 255, 255, 0.5]
        }),
        text: new Text({
					 	textAlign: 'center',
					 	font: '9px',
					 	textBaseline: 'top',
					 	// text: plotInfo.name,
					 	scale: 1.5,
					 	offsetX: 0,
					 	offsetY: 4,
					 	 fill: new Fill({
					 	 	color: 'black'
					 	 }),
					 	
					 	stroke: new Stroke({
					 		width: 0
					 	})
					 })
      })
    );

    feature.setStyle(plots_styles);

  }
}
