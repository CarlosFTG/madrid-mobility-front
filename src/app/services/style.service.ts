import { Injectable } from '@angular/core';

import { Style, Icon as IconStyle, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  assets_base = 'assets/img/';

  constructor() { }

  applyStyleToMarker(bikeStationFeature,bikeStation){

    let markerStyle = [];
      markerStyle.push(
        new Style({
        image: new IconStyle({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: this.assets_base + 'vehicle_pin.png',
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
  
      if(bikeStation.availableBikes > 5){
        markerStyle.push(
          new Style({
            image: new IconStyle(({
              anchor: [21, 70],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              opacity: 1,
              src: this.assets_base + 'vehicle_color_1.png',
              snapToPixel: false
            })),
            //Vehicle Label
            text: new Text({
              // text:
              textAlign: 'center',
              font: '11px Arial',
              textBaseline: 'top',
              fill: new Fill({ color: 'lightCyan' }),
              stroke: new Stroke({ color: 'MediumBlue', width: 1 }),
              offsetX: 0,
              offsetY: 4,
            })
          }),
          // new Style({
          //   image: new IconStyle(({
          //     anchor: [21, 70],
          //     anchorXUnits: 'pixels',
          //     anchorYUnits: 'pixels',
          //     opacity: 1,
          //     src: this.assets_base + 'bike_icon.jpg',
          //     snapToPixel: false
          //   }))
          // })
        )
      }else{
        markerStyle.push(
          new Style({
            image: new IconStyle(({
              anchor: [21, 70],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              opacity: 1,
              src: this.assets_base + 'vehicle_color_2.png',
              snapToPixel: false
            })),
            //Vehicle Label
            text: new Text({
              // text:
              textAlign: 'center',
              font: '11px Arial',
              textBaseline: 'top',
              fill: new Fill({ color: 'lightCyan' }),
              stroke: new Stroke({ color: 'MediumBlue', width: 1 }),
              offsetX: 0,
              offsetY: 4,
            })
          })
        )
      }
      bikeStationFeature.setStyle(markerStyle);
    }

    applyStyleToFoundAdressMarker(foundAddressFeature){
      let markerStyle = [];
      markerStyle.push(
        new Style({
        image: new IconStyle({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: this.assets_base + 'vehicle_pin.png',
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
  
        markerStyle.push(
          new Style({
            image: new IconStyle(({
              anchor: [21, 70],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              opacity: 1,
              src: this.assets_base + 'vehicle_color_7.png',
              snapToPixel: false
            })),
            //Vehicle Label
            text: new Text({
              // text:
              textAlign: 'center',
              font: '11px Arial',
              textBaseline: 'top',
              fill: new Fill({ color: 'lightCyan' }),
              stroke: new Stroke({ color: 'MediumBlue', width: 1 }),
              offsetX: 0,
              offsetY: 4,
            })
          }),
          // new Style({
          //   image: new IconStyle(({
          //     anchor: [21, 70],
          //     anchorXUnits: 'pixels',
          //     anchorYUnits: 'pixels',
          //     opacity: 1,
          //     src: this.assets_base + 'bike_icon.jpg',
          //     snapToPixel: false
          //   }))
          // })
        )
      
      foundAddressFeature.setStyle(markerStyle);
    }
}
