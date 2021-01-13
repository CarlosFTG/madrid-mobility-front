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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCity: string;
  format = new WKT();
  assets_base = 'assets/img/';

  private userPositionOut = new BehaviorSubject<any[]>(null);

  userPosition$ = this.userPositionOut.asObservable();

  constructor(private httpClient: HttpClient, private mapService: MapService, 
    private infoCardService: InfoCardService,public dialog: MatDialog) {
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

    navigator.geolocation.getCurrentPosition(function (location) {
      var lat = location.coords.latitude;
      var lng = location.coords.longitude;


      let locationObj = {
        'lat:': lat,
        'lng': lng
      }

      sessionStorage.setItem('userLat', String(lat));
      sessionStorage.setItem('userLng', String(lng));
      /*  
        globalLatlng = latlng; */
      http.get('https://www.mapquestapi.com/geocoding/v1/reverse?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + location.coords.latitude + ',' + location.coords.longitude).subscribe(
        res => {
          let markerStyle = [];
          //@ts-ignore
          localStorage.setItem('userLocationAddress', res.results[0].locations[0].street)
          //@ts-ignore
          mapService.sendUserPositionToInfoCard(res.results[0].providedLocation.latLng);


          //@ts-ignore
          if (res.results[0].locations[0].adminArea5 === 'Madrid') {
            //@ts-ignore
            let formatCoords = 'POINT(' + res.results[0].providedLocation.latLng.lng + ' ' + res.results[0].providedLocation.latLng.lat + " 216.7" + ')';

            let userPositionCoords = format.readFeature(formatCoords.replace(
              /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

            let userPositionFeature = new Feature({
              geometry: new Point(userPositionCoords)
            });

            markerStyle.push(
              new Style({
                image: new IconStyle({
                  anchor: [0.5, 1],
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'fraction',
                  opacity: 1,
                  src: assets_base + 'vehicle_pin.png',
                  snapToPixel: false
                }),
                //Text Style
                text: new Text({
                  textAlign: 'center',
                  font: '9px',
                  textBaseline: 'top',
                  //text: vehicleInfo.name,
                  scale: 1.5,
                  offsetX: 0,
                  offsetY: 4,
                  // fill: new Fill({
                  //   color: textoVehiculo_color
                  // })
                  // ,
                  stroke: new Stroke({
                    width: 0
                  })
                })
              }),
              new Style({
                image: new IconStyle(({
                  anchor: [16, 70],
                  anchorXUnits: 'pixels',
                  anchorYUnits: 'pixels',
                  opacity: 1,
                  src: 'assets/img/iconmonstr-user-6-32.png',
                  snapToPixel: false
                }))
              })
            );

            userPositionFeature.setStyle(markerStyle);

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


          http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/registerVisit', userCity).subscribe();

        }
      )

      return locationObj;
    });
  }
}
