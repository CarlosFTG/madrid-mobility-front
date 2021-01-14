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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCity: string;
  format = new WKT();
  assets_base = 'assets/img/';

  private userPositionOut = new BehaviorSubject<any[]>(null);

  userPosition$ = this.userPositionOut.asObservable();

  private REST_API_SERVER = "http://localhost:8081/api/auth/EMTServices/";

  constructor(private httpClient: HttpClient, private mapService: MapService,
    private infoCardService: InfoCardService, public dialog: MatDialog, private styleService: StyleService) {
    this.getUserPosition();
  }

  notifyUserPosition(userPosition) {
    this.userPositionOut.next(userPosition)
  }

  getUserPosition() {
    let http = this.httpClient;
    let userCity = this.userCity;
    let mapService = this.mapService;
    let format = this.format;
    let assets_base = this.assets_base;
    let notifyUserPosition = this.notifyUserPosition;
    let dialog = this.dialog;
    let styleService = this.styleService;
    let REST_API_SERVER = this.REST_API_SERVER;

    navigator.geolocation.getCurrentPosition(function (location) {
      var lat = location.coords.latitude;
      var lng = location.coords.longitude;


      let locationObj = {
        'lat:': lat,
        'lng': lng
      }
      http.get('https://www.mapquestapi.com/geocoding/v1/reverse?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + location.coords.latitude + ',' + location.coords.longitude).subscribe(
        res => {
          let markerStyle = [];
          //@ts-ignore
          localStorage.setItem('userLocationAddress', res.results[0].locations[0].street)

          //@ts-ignore
          userCity=res.results[0].locations[0].adminArea5;

          http.get(REST_API_SERVER+'registerVisit',{
            params: {
              'userCity': userCity,
            }
          }
          ).subscribe(
            res =>{
            },
            err=>{
            }
          )

          //@ts-ignore
          if (res.results[0].locations[0].adminArea5 === 'Madrid') {
            //@ts-ignore
            let formatCoords = 'POINT(' + res.results[0].providedLocation.latLng.lng + ' ' + res.results[0].providedLocation.latLng.lat + " 216.7" + ')';
            //@ts-ignore
            let formatCoords2 = 'POINT(' + res.results[0].providedLocation.latLng.lng + ' ' + res.results[0].providedLocation.latLng.lat + ')';

            mapService.updateMapViewCenter(formatCoords2);

            let userPositionCoords = format.readFeature(formatCoords.replace(
              /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

            let userPositionFeature = new Feature({
              geometry: new Point(userPositionCoords)
            });

            //@ts-ignore
            mapService.sendUserPositionToInfoCard(res.results[0].providedLocation.latLng);

            styleService.applyStyleToUser(userPositionFeature);

            let userPositionCollection = new Collection;

            userPositionCollection.push(userPositionFeature);

            let userPositionLayer = new VectorLayer({
              name: 'userPosition',
              source: new VectorSource({
                features: userPositionCollection
              })
            });

            mapService.map$.addLayer(userPositionLayer);
            //@ts-ignore
            userCity = res.results[0].locations[0].adminArea5;
          } else {
            const dialogRef = dialog.open(NomadriddialogComponent, {
              width: '600px',
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(result)
            });

          }

        }, err =>{
          alert(err)
          console.log(err)
        }
      )

      return locationObj;
    });
  }

  registerUserCity() {
        
      
  }
}
