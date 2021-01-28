import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';


import WKT from 'ol/format/WKT';
import { MapService } from './map.service';
import { StreetsStyleService } from './streets-style.service';

@Injectable({
  providedIn: 'root'
})
export class StreetsService {

  private streets;
  streetsCollection = new Collection;
  streetsList =  new Array;

  format = new WKT();

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/urban/EMTServices/";
  //private REST_API_SERVER = "http://localhost:8081/api/urban/EMTServices/";

  private streetsListOut = new BehaviorSubject<any[]>(null);

  streetsList$ = this.streetsListOut.asObservable();

  constructor(private httpClient: HttpClient,private mapService : MapService, private streetsStyleService:StreetsStyleService) {
    this.getStreets().subscribe(data =>{
      this.notifyStreets(data)
    })

    this.getStreetsTopo();
   }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    console.log(errorMessage)
    return throwError(errorMessage);
  }

  getStreets(): Observable<any>{
    return this.streets = this.httpClient.get(this.REST_API_SERVER+'getStreets').pipe(catchError(this.handleError));
  }

  getStreetsTopo(){
      this.httpClient.get(this.REST_API_SERVER+'getStreetsTopo').subscribe(
       res=>{
        this.streets = res;
        this.createStreetsFeatures();
       },err=>{

       }
     );
   }

   createStreetsFeatures(){
    this.streetsCollection = new Collection;
    this.streets.forEach(bikeStation =>{

      //let splitCoords = bikeStation.pointsList.coordinates.split(' ');

      let formatCoords= bikeStation.geom+" 216.7"+')';

      let bikeStationCoords = this.format.readFeature(bikeStation.geom, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates()

        let streetFeature = new Feature({
          geometry: new LineString(bikeStation.geom)
        });

        //streetFeature.setId(bikeStation.stationId);

        // streetFeature.setProperties({ 'availableBikes':bikeStation.availableBikes, 'availableSlots': bikeStation.freeDocks, 
        // 'stationId':bikeStation.stationId, 'name':bikeStation.name, 'updatedAt':bikeStation.updatedAt, 'address':bikeStation.address });
  
        this.streetsStyleService.styleStreets(streetFeature);
        
        this.streetsCollection.push(streetFeature);
    })

    let streetsLayer = new VectorLayer({
			name: 'streets',
			source: new VectorSource({
				features: this.streetsCollection
			})
    })


  // for(let i = 0; i < this.mapService.map$.getLayers().getArray().length;i++){
  //   if(this.mapService.map$.getLayers().getArray()[i].getProperties().name === 'bikeStations'){
  //     this.mapService.map$.removeLayer(this.mapService.map$.getLayers().getArray()[i]);
  //   }
  // } 
    this.mapService.map$.addLayer(streetsLayer);

     for(let i = 0; i < this.mapService.map$.getLayers().getArray().length;i++){
    //  if(this.mapService.map$.getLayers().getArray()[i].getProperties().name === 'bikeStations'){
    //    this.mapService.map$.removeLayer(this.mapService.map$.getLayers().getArray()[i]);
    //  }
    //console.log(this.mapService.map$.getLayers().getArray()[i].getProperties().name)
   }
    
    
  }

  notifyStreets(streets){
    this.streetsListOut.next(streets);
  }
}
