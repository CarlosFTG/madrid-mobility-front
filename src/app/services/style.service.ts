import { Injectable } from '@angular/core';

import { Style, Icon as IconStyle, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  assets_base = 'assets/img/';

  constructor(private mapService: MapService) { }

  changeBikeMarkerStyle(bikeOrSlot){
    
    let markerStyle = [];

   let less2Slots = new Style({
      image: new IconStyle(({
        anchor: [21, 70],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: this.assets_base + 'less.png',
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

    let slotSymbol = new Style({
      image: new IconStyle(({
        anchor: [16, 70],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: this.assets_base + 'iconmonstr-car-21-32.png',
        snapToPixel: false
      }))
    })

    let more2Slots = new Style({
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
    })

    let less2Bikes = new Style({
      image: new IconStyle(({
        anchor: [21, 70],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: this.assets_base + 'less.png',
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

    let more2Bikes = new Style({
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
    })

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

    let layers = this.mapService.map$.getLayers();
    let feature = layers.getArray()[1].getSource().getFeatures();
    for(let i = 0; i < feature.length; i++){
      if(bikeOrSlot === 'slot'){
        
        if(feature[i].values_.availableSlots <= 2){
          markerStyle.push(less2Slots)
          markerStyle.push(slotSymbol)
        }else{
          markerStyle.push(more2Slots)
          markerStyle.push(slotSymbol)
        }
      }else{
        if(feature[i].values_.availableBikes <= 2){
          markerStyle.push(less2Bikes)
        }else{
          markerStyle.push(more2Bikes)
        }
      }
      
      feature[i].setStyle(markerStyle);
    }
  }

  applyStyleToMarker(bikeStationFeature,bikeStation, bikeOrSlot?){

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


      if(bikeOrSlot === undefined || bikeOrSlot === 'bikes'){
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
            new Style({
              image: new IconStyle(({
                anchor: [16, 70],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: this.assets_base + 'iconmonstr-bicycle-1-32.png',
                snapToPixel: false
              }))
            })
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
            }),
              new Style({
                image: new IconStyle(({
                  anchor: [16, 70],
                  anchorXUnits: 'pixels',
                  anchorYUnits: 'pixels',
                  opacity: 1,
                  src: this.assets_base + 'iconmonstr-bicycle-1-32.png',
                  snapToPixel: false
                }))
              })
            
          )
        }
      }else{

        let less2Slots = new Style({
          image: new IconStyle(({
            anchor: [21, 70],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: this.assets_base + 'less.png',
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
    
        let slotSymbol = new Style({
          image: new IconStyle(({
            anchor: [16, 65],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: this.assets_base + 'iconmonstr-car-21-32.png',
            snapToPixel: false
          }))
        })
    
        let more2Slots = new Style({
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
        })
        if(bikeStation.availableSlots <= 1){
          markerStyle.push(less2Slots)
          markerStyle.push(slotSymbol)
        }else{
          markerStyle.push(more2Slots)
          markerStyle.push(slotSymbol)
        }
        

        markerStyle.push()
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
    //       // fill: new Fill({
    //       //   color: textoVehiculo_color
    //       // })
    //       // ,
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
    //         //Vehicle Label
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
         )
      
       foundAddressFeature.setStyle(markerStyle);
     }

    applyStyleToDistricts(feature){
      let plots_styles = [];

      let totalBikes = feature.getProperties().totalBikes;
      let districtName = totalBikes.districtName;

      let noBikes = new Style({
        fill: new Fill({
          color: [131, 145, 146, 0.5]
        }),
        stroke:new Stroke({ 
          color: 'black',
          width: 1,
          zIndex: 1
        }),
        text: new Text({
             textAlign: 'center',
             font: '9px',
             textBaseline: 'top',
              text: districtName,
             scale: 1.5,
             offsetX: 0,
             offsetY: 4,
              fill: new Fill({
                color: 'black'
              }),
             
             stroke: new Stroke({
               width: 2
             })
           })
      })

      let lessThan50Bikes = new Style({
        fill: new Fill({
          color: [247, 220, 111, 0.5]
        }),
        stroke:new Stroke({ 
          color: 'black',
          width: 1,
          zIndex: 1
        }),
        text: new Text({
             textAlign: 'center',
             font: '9px',
             textBaseline: 'top',
             text: districtName,
             scale: 1.5,
             offsetX: 0,
             offsetY: 4,
              fill: new Fill({
                color: 'black'
              }),
             
             stroke: new Stroke({
               width: 2,
               color: 'black'
             })
           })
      })

      let moreThan50Bikes = new Style({
        fill: new Fill({
          color: [36, 113, 163, 0.5]
        }),
        stroke:new Stroke({ 
          color: 'black',
          width: 1,
          zIndex: 1
        }),
        text: new Text({
             textAlign: 'center',
             font: '9px',
             textBaseline: 'top',
             text: districtName,
             scale: 1.5,
             offsetX: 0,
             offsetY: 4,
              fill: new Fill({
                color: 'black'
              }),
             
             stroke: new Stroke({
               width: 2
             })
           })
      })

       if(totalBikes.totalBikes <1){
         plots_styles.push(
  
           noBikes
           );
       }else if(totalBikes.totalBikes <50 && totalBikes.totalBikes > 0){
         plots_styles.push(
  
           lessThan50Bikes
           );
       }else{
        
         plots_styles.push(
  
           moreThan50Bikes
           );
       }
      
     
      feature.setStyle(plots_styles);
    }

    applyStyleToUser(userPositionFeature){
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
    }

    applyStyleToSelectedFeature(feature){
      let markerStyleSelectedFeature = [];
      markerStyleSelectedFeature.push(
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
        }),
        new Style({
          image: new IconStyle(({
            anchor: [21, 70],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: this.assets_base + 'vehicle_color_3.png',
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
        new Style({
          image: new IconStyle(({
            anchor: [16, 70],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: this.assets_base + 'iconmonstr-bicycle-1-32.png',
            snapToPixel: false
          }))
        })
      );

      feature.setStyle(markerStyleSelectedFeature);
    }
}
