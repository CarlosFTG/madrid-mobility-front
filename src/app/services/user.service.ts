import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Injectable } from '@angular/core';
import { MapService } from './map.service';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import { Style, Icon as IconStyle, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import WKT from 'ol/format/WKT';
import { InfoCardService } from '../info-card/services/info-card.service';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { stringify } from 'querystring';
import { MatDialog } from '@angular/material/dialog';
import { NomadriddialogComponent } from '../components/nomadriddialog/nomadriddialog.component';
import { StyleService } from './style.service';
import { ErrordialogComponent } from '../components/errordialog/errordialog.component';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { StylePointsFeaturesService } from './style-points-features.service';
import { ActivateLocationModalComponent } from '../components/activate-location-modal/activate-location-modal.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCity: string;
  userPosition;
  format = new WKT();
  assets_base = 'assets/img/';

  private userPositionOut = new BehaviorSubject<any>(null);

  userPosition$ = this.userPositionOut.asObservable();

  //private REST_API_SERVER = "http://localhost:8081/api/auth/EMTServices/";
  private REST_API_SERVER_URBAN = "http://localhost:8081/api/urban/EMTServices/";
  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/auth/EMTServices/";

  constructor(private httpClient: HttpClient, private mapService: MapService,
    private infoCardService: InfoCardService, public dialog: MatDialog,
    private stylePointsFeaturesService: StylePointsFeaturesService,
    private router: Router) {
    this.getUserPosition();
  }

  // notifyUserPosition(userPosition) {
  //   this.userPositionOut.next(userPosition)
  // }

  handleError(error: HttpErrorResponse) {
    let dialog: MatDialog;
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
  async getUserPosition() {
    let coords = await this.fetchCoordinates();

    if (coords !== undefined) {
      //@ts-ignore
      this.getGeoCoding(coords.coords);

      let userCoords = {
        //@ts-ignore
        lat: coords.coords.latitude,
        //@ts-ignore
        lng: coords.coords.longitude
      }
      localStorage.setItem('userCoords', JSON.stringify(userCoords));
    }
  }

  getCoordinates() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async fetchCoordinates() {
    const position = await this.getCoordinates()
      .catch(err => console.log(err));

    if (position === undefined) {
      const dialogRef = this.dialog.open(ActivateLocationModalComponent, {
        width: '600px',
      });

      // dialogRef.afterClosed().subscribe(result => {
      //   this.router.navigate(['geoError']);
      // });
    } else {
      return position;
    }
  }

  
  getGeoCoding(coords) {
    let userCity
    this.getGeoCodingAPI(coords).subscribe(
      res => {
        //@ts-ignore
        if (res.features[0].properties != undefined) {

          let address = res.features[0].properties.label.split(',')[0];

          this.infoCardService.notifyNewUserPosition(address);

          userCity = res.features[0].properties.locality;
        }
        this.registerVisit(userCity);
        //@ts-ignore
        this.checkIfUserInMadrid(userCity, coords.longitude, coords.latitude);
      }, err => {
        // let params = {
        //   //@ts-ignore
        //   'coordinates': 'POINT (' + coords.longitude + ' ' + coords.latitude + '),3857)'
        // }
        //  this.httpClient.post(this.REST_API_SERVER_URBAN+'checkIfUserInMadrid', params).subscribe(
        //    res=>{
        //      console.log(res)
        //    },err=>{
        //      console.log(err)
        //    }
        //  );
        const dialogRef = this.dialog.open(NomadriddialogComponent, {
          width: '600px',
        });

        dialogRef.componentInstance.apiError = true;

        dialogRef.afterClosed().subscribe(result => {
          console.log(result)
        });
      }
    )
  }

  getGeoCodingAPI(coords): Observable<any> {
    let lat = coords.latitude;
    let lng = coords.longitude;
    return this.httpClient.get('https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf62485f1920e92dc94c50bc5c40c1b2d2ed46&point.lon='
      + lng + '&point.lat=' + lat).pipe(
        retry(3),
        catchError(this.handleError)
      );
    shareReplay();
  }



  registerVisit(userCity) {
    this.httpClient.get(this.REST_API_SERVER + 'registerVisit', {
      params: {
        'userCity': userCity,
      }
    }
    ).subscribe(
      res => {
      },
      err => {
        console.log(err)
      }
    )
  }

  checkIfUserInMadrid(userCity, lng, lat) {
    if (userCity === 'Madrid') {
      let formatCoords = 'POINT(' + lng + ' ' + lat + " 216.7" + ')';
      let formatCoords2 = 'POINT(' + lng + ' ' + lat + ')';

      this.mapService.updateMapViewCenter(formatCoords2);

      let userPositionCoords = this.format.readFeature(formatCoords.replace(
        /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

      let userPositionFeature = new Feature({
        geometry: new Point(userPositionCoords)
      });

      let latLng = {
        'lat': lat,
        'lng': lng
      }

      //@ts-ignore
      this.mapService.sendUserPositionToInfoCard(latLng);

      this.stylePointsFeaturesService.applyStyleToUser(userPositionFeature);

      let userPositionCollection = new Collection;

      userPositionCollection.push(userPositionFeature);

      let userPositionLayer = new VectorLayer({
        name: 'userPosition',
        source: new VectorSource({
          features: userPositionCollection
        })
      });

      this.mapService.map$.addLayer(userPositionLayer);
      //@ts-ignore
    } else {
      const dialogRef = this.dialog.open(NomadriddialogComponent, {
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
      });

    }
  }

}
