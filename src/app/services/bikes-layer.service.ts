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
import { throwError } from 'rxjs';
import { StyleService } from './style.service';

@Injectable({
  providedIn: 'root'
})
export class BikesLayerService {

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";

  biciMadAPIStatus;
  accesToken;
  response: any;
  format = new WKT();
  //bikeStations: any[] = new Array;
  bikeStationsCollection = new Collection;

  constructor(private httpClient: HttpClient, 
    private mapService : MapService,
    private styleService: StyleService) {
  
    this.getBikeStations();
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
    return this.httpClient.post(this.REST_API_SERVER+'findClosestStations', params).pipe(catchError(this.handleError));
  }

  getBikeStations(){
    this.httpClient.get('http://localhost:8081/api/EMTServices/checkAvaibility').subscribe(
    //this.httpClient.get(this.REST_API_SERVER+'checkAvaibility').subscribe(
      res =>{
        this.response = res;
        this.createBikeStationsFeatures();
      }
    )
  }

  createBikeStationsFeatures(){
    this.response.forEach(bikeStation =>{

      let splitCoords = bikeStation.pointsList.coordinates.split(',');

      let formatCoords= 'POINT('+splitCoords[0]+ ' '+ splitCoords[1]+" 216.7"+')';

      let bikeStationCoords = this.format.readFeature(formatCoords.replace(
        /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

        let bikeStationFeature = new Feature({
          geometry: new Point(bikeStationCoords)
        });
  
        this.styleService.applyStyleToMarker(bikeStationFeature,bikeStation);
        this.bikeStationsCollection.push(bikeStationFeature);
    })

    let bikeStationsLayer = new VectorLayer({
			name: 'bikeStations',
			source: new VectorSource({
				features: this.bikeStationsCollection
			})
		})

		this.mapService.map$.addLayer(bikeStationsLayer);
  }

}
