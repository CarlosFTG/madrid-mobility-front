import { HttpClient } from '@angular/common/http';
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
import { TabledetailComponent } from '../components/tabledetail/tabledetail.component';
import { MatDialog } from '@angular/material/dialog';
import { NomadriddialogComponent } from '../components/nomadriddialog/nomadriddialog.component';
import { StyleService } from './style.service';
import { ErrordialogComponent } from '../components/errordialog/errordialog.component';

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

  private REST_API_SERVER = "http://localhost:8081/api/auth/EMTServices/";
  //private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/auth/EMTServices/";

  constructor(private httpClient: HttpClient, private mapService: MapService,
    private infoCardService: InfoCardService, public dialog: MatDialog, private styleService: StyleService) {
    this.getUserPosition();
  }

  // notifyUserPosition(userPosition) {
  //   this.userPositionOut.next(userPosition)
  // }

  async getUserPosition() {
    let coords = await this.fetchCoordinates();
    //@ts-ignore
    this.getGeoCoding(coords.coords)

  }

  getCoordinates() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async fetchCoordinates() {
    // notice, no then(), cause await would block and 
    // wait for the resolved result
    const position = await this.getCoordinates();

    // Actually return a value
    return position;
  }

  getGeoCoding(coords) {
    let lat = coords.latitude;
    let lng = coords.longitude;
    this.httpClient.get('https://www.mapquestapi.com/geocoding/v1/reverse?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location='
      + lat + ',' + lng).subscribe(
        res => {
          //@ts-ignore
          if(res.results[0].locations[0] != undefined){
            //@ts-ignore
            localStorage.setItem('userLocationAddress', res.results[0].locations[0].street);
          }
          
          //@ts-ignore
          let userCity = res.results[0].locations[0].adminArea5;
          this.registerVisit(userCity);
          //@ts-ignore
          this.checkIfUserInMadrid(userCity,res.results[0].providedLocation.latLng.lng, res.results[0].providedLocation.latLng.lat, res.results[0].providedLocation.latLng);
        },
        err => {
          const dialogRef = this.dialog.open(ErrordialogComponent, {
            width: '600px',
            data: { err: err }
          });
        }
      )
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

      }
    )
  }

  checkIfUserInMadrid(userCity, lng,lat,latLng){
    if (userCity === 'Madrid') {
      let formatCoords = 'POINT(' + lng + ' ' + lat + " 216.7" + ')';
      let formatCoords2 = 'POINT(' + lng + ' ' + lat + ')';

      this.mapService.updateMapViewCenter(formatCoords2);

      let userPositionCoords = this.format.readFeature(formatCoords.replace(
        /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

      let userPositionFeature = new Feature({
        geometry: new Point(userPositionCoords)
      });

      //@ts-ignore
      this.mapService.sendUserPositionToInfoCard(latLng);

      this.styleService.applyStyleToUser(userPositionFeature);

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
