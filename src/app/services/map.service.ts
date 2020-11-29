import { Injectable } from '@angular/core';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

//OpenLayers
import { Map } from 'ol';
import { defaults as defaultInteractions } from 'ol/interaction';
import WKT from 'ol/format/WKT';
//import Icon from 'ol/style/Icon';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile.js';
import { BingMaps } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import View from 'ol/View';
import { getCenter } from 'ol/extent';
//import { TranslateService } from '@ngx-translate/core';
//import * as moment from 'moment';

import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map;
  layers = [];
  viewCoordinates: String = 'POINT(-3.703606430985161 40.41666320878426)';
  view;
  format = new WKT();

  private userPositionOut = new BehaviorSubject<any[]>(null);
  private deviceOut = new BehaviorSubject<boolean>(null);
  sendUserPositionToInfoCard$ = this.userPositionOut.asObservable();
  sendDevice$ = this.deviceOut.asObservable();

  constructor() { }

  sendUserPositionToInfoCard(userPosition: any) {
    this.userPositionOut.next(userPosition);
  }

  sendDevice(device: boolean){
    this.deviceOut.next(device);
  }

  get map$() {
    return this.map;
  }

  renderMap() {
    this.layers = [
      new TileLayer({
        name: 'base',
        source: new BingMaps({
          key: 'AlqHetBTtIFed0g61VUmEq079AmyyXfR9FPcqzBt13dvYZsuowl7ZTMFtWJik0LL',
          imagerySet: ['AerialWithLabelsOnDemand']
        })
      })
    ];

    this.view = new View({
      center: this.format.readFeature(this.viewCoordinates, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates(),
      zoom: 17,
      maxZoom: 20,
    });

    let interactions = defaultInteractions({ altShiftDragRotate: false, pinchRotate: false });

    this.map = new Map({
      layers: this.layers,
      target: document.getElementById('map'),
      controls: [],
      view: this.view,
      interactions: interactions

    });
  }

  updateMapViewCenter(viewCoordinates){
    this.viewCoordinates = new String;
    
    this.viewCoordinates = viewCoordinates;
    this.view = new View({
      center: this.format.readFeature(this.viewCoordinates, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates(),
      zoom: 17,
      maxZoom: 20,
    });
    
    this.map.setView(this.view)
  }
}
