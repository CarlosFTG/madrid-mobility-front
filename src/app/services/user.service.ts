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

import { Observable, throwError,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCity: string;
  format = new WKT();
  assets_base = 'assets/img/';

  private userPositionOut = new BehaviorSubject<any[]>(null);

  userPosition$ = this.userPositionOut.asObservable();

  constructor(private httpClient: HttpClient, private mapService: MapService, private infoCardService:InfoCardService) {
    this.getUserPosition();
  }

  notifyUserPosition(userPosition){
    this.userPositionOut.next(userPosition)
  }

  getUserPosition() {
    let http = this.httpClient;
    //let dialog = this.dialog;
    let lat;
    let lng;
    let userCity = this.userCity;
    //let globalLatlng = this.globalLatlng;
    let mapService = this.mapService;
    let format = this.format;
    let assets_base = this.assets_base;
    let notifyUserPosition = this.notifyUserPosition;
    let userPosition;
    navigator.geolocation.getCurrentPosition(function (location) {
      //var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

      /*  
        globalLatlng = latlng; */
      http.get('https://www.mapquestapi.com/geocoding/v1/reverse?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + location.coords.latitude + ',' + location.coords.longitude).subscribe(
        res => {
          let markerStyle = [];
          //@ts-ignore
          mapService.sendUserPositionToInfoCard(res.results[0].providedLocation.latLng);

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
          // http.post('http://localhost:8081/api/EMTServices/registerVisit', userCity).subscribe();
          http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/registerVisit', userCity).subscribe();
          //userCity = 'Bcn'
          // if (userCity !== 'Madrid') {
          //   const dialogRef = dialog.open(NomadriddialogComponent, {
          //     width: '600px',

          //   });
          //   dialogRef.afterClosed().subscribe(result => {
          //     let coords = result.split(',');
          //     let coordsArray = new Array;
          //     coordsArray.push(parseFloat(coords[0]));
          //     coordsArray.push(parseFloat(coords[1]));
          //     var myIcon = L.icon({
          //       iconSize: [41, 51],
          //       iconAnchor: [20, 51],
          //       popupAnchor: [-3, -76],
          //       shadowSize: [68, 95],

          //       shadowAnchor: [22, 94]
          //     });
          //     myIcon.options.iconUrl = 'assets/leaflet/user.png';
          //     //@ts-ignore
          //     marker = L.marker(coordsArray, {
          //       icon: myIcon, clickable:
          //         true, draggable: 'false'
          //     }).addTo(mapLeaflet);
          //     //@ts-ignore
          //     mapLeaflet.setView(coordsArray, 22);
          //     //@ts-ignore
          //     globalLatlng.lng = coordsArray[0];
          //     //@ts-ignore
          //     globalLatlng.lat = coordsArray[1];
          //   });
          // } else {

          // //@ts-ignore
          // globalLatlng.lng = latlng.lat;
          // //@ts-ignore
          // globalLatlng.lat = latlng.lng;
           
          //}
        }
      )

      //return globalLatlng;
    });
  }

  addLocationToMap() {

  }
}
