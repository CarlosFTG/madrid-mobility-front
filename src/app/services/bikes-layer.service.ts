import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { AuthModel } from '../models/authResponse.model';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';

import WKT from 'ol/format/WKT';
import { MapService } from './map.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError,BehaviorSubject } from 'rxjs';
import { StyleService } from './style.service';
import { AuthModuleModule } from '../auth-module/auth-module.module';
import { AuthService } from '../auth-module/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BikesLayerService {

  bikeStations;

  token: string;

  private bikesOut = new BehaviorSubject<boolean>(null);

  bikes$ = this.bikesOut.asObservable();

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";
  //private REST_API_SERVER = "http://localhost:8081/api/EMTServices/";

  biciMadAPIStatus;
  accesToken;
  response: any;
  format = new WKT();
  //bikeStations: any[] = new Array;
  bikeStationsCollection = new Collection;
  userPosition = { 'lat': null, 'lng': null };

  constructor(private httpClient: HttpClient, 
    private mapService : MapService,
    private styleService: StyleService,
    private authService: AuthService) {

      this.mapService.sendUserPositionToInfoCard$.subscribe(data => {
        if (data != null) {
          if (typeof (data) === 'object') {
            //@ts-ignore
            this.userPosition.lat = data.lat;
            //@ts-ignore
            this.userPosition.lng = data.lng;
            this.bikeStations= this.getBikeStations();
          } else {
            let fakeAddressSplt = String(data).split(' ');
            //@ts-ignore
            this.userPosition.lat = fakeAddressSplt[1];
            //@ts-ignore
            this.userPosition.lng = fakeAddressSplt[0];
            this.bikeStations= this.getBikeStations();
          }
        }
      })
    
      this.authService.emtToken$.subscribe(token=>{
        if(token != null){
          this.token = token;
          this.bikeStations= this.getBikeStations();
        }
      })
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
    return throwError(errorMessage);
  }

  getClosestsStations(params): Observable<any> {
    console.log(params)
    return this.httpClient.post(this.REST_API_SERVER+'findClosestStations', params).pipe(catchError(this.handleError));
  }



  getBikeStations(){
    if(this.token != undefined && this.userPosition.lng != undefined){
      this.httpClient.get(this.REST_API_SERVER+'checkAvaibility',{
        params: {
          'emtToken': this.token,
        }
      }
     // this.httpClient.get('http://localhost:8081/api/EMTServices/checkAvaibility',
  //    params: {
  //     'emtToken': this.token,
  //   }
  // }
      ).subscribe(
        res =>{
          this.response = res;
          this.createBikeStationsFeatures();
        }
      )
    }
    
  }

  createBikeStationsFeatures(bikeOrSlot?: string){
    this.response.forEach(bikeStation =>{

      let splitCoords = bikeStation.pointsList.coordinates.split(',');

      let formatCoords= 'POINT('+splitCoords[0]+ ' '+ splitCoords[1]+" 216.7"+')';

      let bikeStationCoords = this.format.readFeature(formatCoords.replace(
        /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

        let bikeStationFeature = new Feature({
          geometry: new Point(bikeStationCoords)
        });

        bikeStationFeature.setProperties({ 'availableBikes':bikeStation.availableBikes, 'availableSlots': bikeStation.freeDocks });
  
        if(bikeOrSlot === undefined){
          this.styleService.applyStyleToMarker(bikeStationFeature,bikeStation);
        }else{
          this.styleService.applyStyleToMarker(bikeStationFeature,bikeStation, bikeOrSlot);
        }
        
        this.bikeStationsCollection.push(bikeStationFeature);
    })

    let bikeStationsLayer = new VectorLayer({
			name: 'bikeStations',
			source: new VectorSource({
				features: this.bikeStationsCollection
			})
    })


  for(let i = 0; i < this.mapService.map$.getLayers().getArray().length;i++){
    if(this.mapService.map$.getLayers().getArray()[i].getProperties().name === 'bikeStations'){
      this.mapService.map$.removeLayer(this.mapService.map$.getLayers().getArray()[i]);
    }
  } 
    this.mapService.map$.addLayer(bikeStationsLayer);
    
    this.notifyBikes(true);
  }

  notifyBikes(bikesLoaded){
    this.bikesOut.next(bikesLoaded)
  }

}
