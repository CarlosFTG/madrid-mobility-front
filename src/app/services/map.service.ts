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
import Select from 'ol/interaction/Select';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import View from 'ol/View';
import { getCenter } from 'ol/extent';
//import { TranslateService } from '@ngx-translate/core';
//import * as moment from 'moment';

import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';
import { InfoPopupComponent } from '../components/info-popup/info-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LegendService } from '../legend/services/legend.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map;
  layers = [];
  viewCoordinates: String = 'POINT(-3.703606430985161 40.41666320878426)';
  view;
  format = new WKT();
  selectIndex: number=0;

  private userPositionOut = new BehaviorSubject<any[]>(null);
  private deviceOut = new BehaviorSubject<boolean>(null);
  sendUserPositionToInfoCard$ = this.userPositionOut.asObservable();
  sendDevice$ = this.deviceOut.asObservable();

  constructor(public dialog: MatDialog,private legendService: LegendService) {
    this.legendService.toggleChange$.subscribe(index =>{
      if(index != null){
        this.selectIndex=index;
      }
    })
   }

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
          imagerySet: ['CanvasDark']
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

  selectOnMap(){
    let bikeStationsLayerIndex;
    let dialog = this.dialog;
    for(let i = 0; i < this.map$.getLayers().getArray().length;i++){
      console.log(this.map$.getLayers().getArray()[i].values_.name)
      if(this.map$.getLayers().getArray()[i].values_.name === 'bikeStations'){
        bikeStationsLayerIndex=i;
      }
    }
    let targetLayer = this.map$.getLayers().getArray()[bikeStationsLayerIndex];
    
     let select = new Select({
       layers: [targetLayer],
       //style:selectStyle
     });
     
      select.getFeatures().on('change:length', function (e) {
        var feature_buff = select.getFeatures();
        if(feature_buff.getLength() >0){
            for (var i = 0; i < feature_buff.getLength(); i++) {
              const dialogRef = dialog.open(InfoPopupComponent, {
                width: '600px',
              });
              dialogRef.componentInstance.totalBikes = feature_buff.item(0).values_.availableBikes;
              dialogRef.componentInstance.availableSlots = feature_buff.item(0).values_.availableSlots;
              dialogRef.componentInstance.name = feature_buff.item(0).values_.name;
              dialogRef.componentInstance.address = feature_buff.item(0).values_.address;
              dialogRef.componentInstance.updatedAt = feature_buff.item(0).values_.updatedAt;
            }
          
          //detecta cuando no se hace click sobre alguna feature
        }else{
          // vehiclesRoutesService.openInfoCard(null);
          // sharedService.updateVehicleSelection(null);
        }
         
      });
      if(this.selectIndex <1){
        this.selectIndex++;
        this.map$.addInteraction(select);
      }
  }
}
