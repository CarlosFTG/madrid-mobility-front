import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import Feature from 'ol/Feature';
import LineString from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import WKT from 'ol/format/WKT';
import { MapService } from './map.service';
import { StyleLineFeaturesService } from './style-line-features.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  lineCollection = new Collection;
  format = new WKT();

  private routeOut = new BehaviorSubject<boolean>(null);

  route$ = this.routeOut.asObservable();

  constructor(private httpClient: HttpClient, private mapService:MapService, private styleLineFeaturesService:StyleLineFeaturesService) { }

  getRoute(userCoords,bikeStationCoords):Observable<any>{
    
    let userCoordsStr = userCoords.lng+ ','+userCoords.lat;
    let bikeStationCoordsStr = bikeStationCoords.lat+ ','+bikeStationCoords.lng

     //http://www.mapquestapi.com/directions/v2/route?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA
    return this.httpClient.get('https://api.openrouteservice.org/v2/directions/foot-walking?api_key=<APIKEY>&start='
     +userCoordsStr+'&end='+bikeStationCoordsStr).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        //return this.handle401Error(request, next);
      } else {
        console.log(error)
        return throwError(error);
      }
    }));
  }

  createRouteLayer(coordinates){
    this.lineCollection=new Collection;
    coordinates.forEach(coordinates =>{

      //let splitCoords = coordinates.pointsList.coordinates.split(' ');

      let formatCoords= 'POINT('+coordinates[0]+ ' '+ coordinates[1]+" 216.7"+')';

      let lineCoords = this.format.readFeature(formatCoords.replace(
        /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

        let lineFeature = new Feature({
          geometry: new LineString(lineCoords)
        });

        // bikeStationFeature.setId(coordinates.stationId);

        // bikeStationFeature.setProperties({ 'availableBikes':coordinates.availableBikes, 'availableSlots': coordinates.freeDocks, 
        // 'stationId':coordinates.stationId, 'name':coordinates.name, 'updatedAt':coordinates.updatedAt, 'address':coordinates.address });
  
           //this.styleLineFeaturesService.styleRoute(lineFeature);
        
        this.lineCollection.push(lineFeature);
    });

    let routeLayer = new VectorLayer({
			name: 'route',
			source: new VectorSource({
				features: this.lineCollection
			})
    })
    this.clearRoute();
    this.mapService.map$.addLayer(routeLayer);
    this.notifyRoute();
  }

  clearRoute(){
    for(let i = 0; i < this.mapService.map$.getLayers().getArray().length;i++){
      if(this.mapService.map$.getLayers().getArray()[i].getProperties().name === 'route'){
        this.mapService.map$.removeLayer(this.mapService.map$.getLayers().getArray()[i]);
      }
    }
  }

  notifyRoute(){
    this.routeOut.next(true);
  }
}
