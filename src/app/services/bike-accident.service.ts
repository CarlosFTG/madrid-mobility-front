import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';

import Heatmap from 'ol/layer/Heatmap';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import WKT from 'ol/format/WKT';
import Point from 'ol/geom/Point';
import { MapService } from './map.service';

import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class BikeAccidentService {

  
  private REST_API_SERVER = environment.baseUrl+'bikes/EMTServices/';

  private bikeAccidents: any;

  bikeAccidentsCollection = new Collection;

  format = new WKT();

  constructor(private httpClient: HttpClient, private mapService: MapService) {
    this.getBikeAccidents();
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

  public getBikeAccidents(): Observable<any[]> {

    this.httpClient.get(this.REST_API_SERVER + 'getBikeAccidents').subscribe(
      res => {
        this.createHeatMap(res)
      }, err => {

      }
    )
    return this.bikeAccidents;
  }

  createHeatMap(res) {

    // res.forEach(bikeAccident => {

    //   let bikeAccidentCoords = this.format.readFeature(bikeAccident.accidentPoint, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates()


    //   let bikeAccidentFeature = new Feature({
    //     geometry: new Point(bikeAccidentCoords)
    //   });
    //   this.bikeAccidentsCollection.push(bikeAccidentFeature);
    // });

    // let bikeAccidentsLayer = new VectorLayer({
    //   name: 'bikeAccidents',
    //   source: new VectorSource({
    //     features: this.bikeAccidentsCollection
    //   })
    // })
    // let heatmap = new Heatmap({
    //   source: bikeAccidentsLayer
    // });

    //this.mapService.map$.addLayer(heatmap);

  }

}
