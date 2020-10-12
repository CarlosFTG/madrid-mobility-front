import { Component, OnInit, Inject, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { LoaadingNearStationsComponent } from '../loaading-near-stations/loaading-near-stations.component';

import { NomadriddialogComponent } from '../nomadriddialog/nomadriddialog.component';
import { ErrordialogComponent } from '../errordialog/errordialog.component';
import { TabledetailComponent } from '../tabledetail/tabledetail.component'
import { BikeAccidentService } from '../../services/bike-accident.service'
import { InfoCardService } from '../../info-card/services/info-card.service';
import { MapService } from '../../services/map.service';

declare let L;
var marker;
var polygon;
let mapLeaflet;
//var globalLatlng
var polygon
var userCity;
var legend
let maxBounds = [[[-3.8094818592, 40.3347849588], [-3.5842621326, 40.3347849588], [-3.5842621326, 40.51042249], [-3.8094818592, 40.51042249], [-3.8094818592, 40.3347849588]]]

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  userPosition;
  varmap: MatExpansionPanel;


  selectedStation: any;

  checked = false;
  disabled = false;
  bikeStations = new Array;

  loadCompleted: boolean = false;
  //sliderPosition:boolean=true;


  globalLatlng: object = new Object();
  markers: any[] = new Array;
  markerIcon: any;
  markerGroup: any;
  iconSize: any;
  showDocks: boolean = false;
  accidentsLocationArray = new Array;
  accidentsheatMap: any;
  closetsStation: any[] = new Array;
  icon;
  zoomTo;
  /* @ViewChild("mapAccordeon", { static: true }) mapAccordeon: MatExpansionPanel;*/
  //@ViewChild("detail", { static: true }) detail: MatExpansionPanel; 
  @ViewChild("noMadridDialog", { static: true }) noMadridDialog: NomadriddialogComponent;
  @ViewChild("tabledetailComponent", { static: true }) tabledetailComponent: TabledetailComponent;
  //@ViewChild(LegendComponent, { static: true }) legendComponent: LegendComponent;

  constructor(private _http: HttpClient, public dialog: MatDialog,
    private bikeAccidentService: BikeAccidentService,
    private infoCardService: InfoCardService,
    private mapService: MapService) {


  }
  dialogRef = this.dialog;
  dialogCalculatingNearStations = this.dialog;

  ngOnInit() {
    this.detectDevice();
    mapLeaflet = L.map('mapLeaflet').setView([40.4167754, -3.7037902], 13);

    // L.tileLayer('https://wms.qgiscloud.com/CarlosFTG/accidents_heatmap/').addTo(mapLeaflet);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 13
    }).addTo(mapLeaflet);

    L.control({ position: 'bottomright' });
    //this.getBikeAccidents();
    this.getInfo();
    this.getUserPosition();
    this.openDialog();
    this.getDistricts();

    this.iconSize = [20, 51];

    this.infoCardService.sendClosestsStationsToMap$.subscribe(closetsStations => {
      if (closetsStations != null) {
        this.openTableDetail();
      }
    });

    this.infoCardService.sendFoundAdressIconToMap$.subscribe(icon =>{
      this.icon = icon;
      if(this.icon != null){
        mapLeaflet.setView([this.icon._latlng.lat,this.icon._latlng.lng], 22);
        this.icon.addTo(mapLeaflet);
      }
    })

    this.infoCardService.zoomTo$.subscribe(zoomTo =>{
      this.zoomTo = zoomTo;
      if(this.zoomTo != null){
        if(this.zoomTo.option === 'userPosition'){
          mapLeaflet.setView([this.zoomTo.position.lng,this.zoomTo.position.lat], 22);
        }else{
          mapLeaflet.setView([this.zoomTo.position[0],this.zoomTo.position[1]], 13);
        }
        
      }
    })

  }

  /* getCoords(){

    mapLeaflet.addEventListener('click', function(ev) {
      console.log(ev)
   });
    
  } */

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      //disableClose: true, 
      width: '600px',

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  };

  openCalculatingNearStationsDialog(): void {
    const dialogRef = this.dialog.open(LoaadingNearStationsComponent, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getUserPosition() {
    let http = this._http;
    let dialog = this.dialog;
    let lat;
    let lng;
    let globalLatlng = this.globalLatlng;
    let mapService = this.mapService;
    navigator.geolocation.getCurrentPosition(function (location) {
      var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

      /*  
        globalLatlng = latlng; */
      http.get('https://www.mapquestapi.com/geocoding/v1/reverse?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + latlng.lat + ',' + latlng.lng).subscribe(
        res => {
          //@ts-ignore
          userCity = res.results[0].locations[0].adminArea5;
          // http.post('http://localhost:8081/api/EMTServices/registerVisit', userCity).subscribe();
          http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/registerVisit', userCity).subscribe();
          //userCity = 'Bcn'
          if (userCity !== 'Madrid') {
            const dialogRef = dialog.open(NomadriddialogComponent, {
              width: '600px',

            });
            dialogRef.afterClosed().subscribe(result => {
              let coords = result.split(',');
              let coordsArray = new Array;
              coordsArray.push(parseFloat(coords[0]));
              coordsArray.push(parseFloat(coords[1]));
              var myIcon = L.icon({
                iconSize: [41, 51],
                iconAnchor: [20, 51],
                popupAnchor: [-3, -76],
                shadowSize: [68, 95],

                shadowAnchor: [22, 94]
              });
              myIcon.options.iconUrl = 'assets/leaflet/user.png';
              //@ts-ignore
              marker = L.marker(coordsArray, {
                icon: myIcon, clickable:
                  true, draggable: 'false'
              }).addTo(mapLeaflet);
              //@ts-ignore
              mapLeaflet.setView(coordsArray, 22);
              //@ts-ignore
              globalLatlng.lng = coordsArray[0];
              //@ts-ignore
              globalLatlng.lat = coordsArray[1];
            });
          } else {

            var myIcon = L.icon({
              iconSize: [41, 51],
              iconAnchor: [20, 51],
              popupAnchor: [-3, -76],
              shadowSize: [68, 95],

              shadowAnchor: [22, 94]
            });
            myIcon.options.iconUrl = 'assets/leaflet/user.png';
            var marker = L.marker(latlng, {
              icon: myIcon, clickable:
                true, draggable: false
            }).addTo(mapLeaflet);

            //mapLeaflet.setView(latlng, 22);
            //@ts-ignore
            globalLatlng.lng = latlng.lat;
            //@ts-ignore
            globalLatlng.lat = latlng.lng;
            mapService.sendUserPositionToInfoCard(globalLatlng);
          }
        }
      )

      return globalLatlng;
    });
  }

  openErrorDialog() {
    const dialogRef = this.dialog.open(ErrordialogComponent, {
      width: '600px',

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  toggleSlide(event: any) {
    var myIcon = L.icon({
      iconSize: this.iconSize,
      iconAnchor: [20, 51],
      popupAnchor: [-3, -76],
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
    });
    if (event.checked) {
      this.showDocks = true;
      this.markerGroup.clearLayers();
      this.putBikeStationsOnMap(myIcon);
      //this.legendComponent.setBikeOrDot('docks');
    } else {
      this.showDocks = false;
      this.markerGroup.clearLayers();
      this.putBikeStationsOnMap(myIcon);
      //this.legendComponent.setBikeOrDot('bikes');
    }
  }



  getInfo() {
    this.markerGroup = L.layerGroup().addTo(mapLeaflet);
    // this._http.get('http://localhost:8081/api/EMTServices/checkAvaibility').subscribe(
    this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/checkAvaibility').subscribe(
      res => {

        var myIcon = L.icon({
          iconSize: [11, 21],
          iconAnchor: [20, 51],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        });
        for (let i = 0; i < 214; i++) {
          this.bikeStations.push(res[i]);
        }
        this.putBikeStationsOnMap(myIcon);
        //mapLeaflet.layers
        this.dialogRef.closeAll()
        this.dialogRef.ngOnDestroy();
      }, err => {
        this.dialogRef.closeAll()
        this.dialogRef.ngOnDestroy();
        this.openErrorDialog();
      });
  }



  getDistricts() {
    // this._http.get('http://localhost:8081/api/EMTServices/getDistricts').subscribe(
    this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/getDistricts').subscribe(
      res => {
        //@ts-ignore
        for (let i = 0; i < res.length; i++) {
          var style = {
            'color': 'null'
          };
          if (res[i].totalBikes == 0) {
            style.color = 'grey'
          } else if (res[i].totalBikes <= 50) {
            style.color = 'yellow'
          } else {
            style.color = 'blue'
          }
          let polygonAllcoordsPair = new Array;
          let geom = res[i].geom.substring(16, res[i].geom.length - 3);
          geom = geom.split(',');
          for (let j = 0; j < geom.length; j++) {
            let coordsPair = geom[j].trim().split(' ');
            let coordsPairArray = new Array;
            coordsPairArray.push(parseFloat(coordsPair[1]))
            coordsPairArray.push(parseFloat(coordsPair[0]))
            polygonAllcoordsPair.push(coordsPairArray)
          }
          polygon = L.polygon(polygonAllcoordsPair, style).addTo(mapLeaflet);
        }
      }
    )
  }

  detectZoomChange() {
    let zoomLevel = mapLeaflet.getZoom();
    if (zoomLevel <= 15) {
      this.markerGroup.clearLayers();
      var myIcon = L.icon({
        iconSize: [21, 31],
        iconAnchor: [20, 51],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      });
      this.iconSize = [20, 51]
      this.putBikeStationsOnMap(myIcon);

    } else if (zoomLevel > 15) {
      this.markerGroup.clearLayers();
      var myIcon = L.icon({
        iconSize: [41, 51],
        iconAnchor: [20, 51],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      });
      this.iconSize = [41, 51]
      this.putBikeStationsOnMap(myIcon);
    } else if (zoomLevel < 14) {
      this.markerGroup.clearLayers();
      var myIcon = L.icon({
        iconSize: [11, 21],
        iconAnchor: [20, 51],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      });
      this.iconSize = [11, 21]
      this.putBikeStationsOnMap(myIcon);
    }
  }

  putBikeStationsOnMap(myIcon) {
    for (let i = 0; i < this.bikeStations.length; i++) {
      var lat = this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
      var lng = this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',') + 1, this.bikeStations[i].pointsList.coordinates.length);

      if (!this.showDocks) {
        if (this.bikeStations[i].availableBikes > 0) {
          myIcon.options.iconUrl = 'assets/leaflet/green_bike.png'
        } else {
          myIcon.options.iconUrl = 'assets/leaflet/red_bike.png'
        }
      } else {
        if (this.bikeStations[i].freeDocks > 0) {
          myIcon.options.iconUrl = 'assets/leaflet/green_dot.jpg'
        } else {
          myIcon.options.iconUrl = 'assets/leaflet/red_dot.png'
        }
      }

      var coordsArray = new Array;
      coordsArray.push(lng); coordsArray.push(lat);
      marker = L.marker(coordsArray, {
        icon: myIcon, clickable:
          true, draggable: false
      }).addTo(this.markerGroup).bindPopup('<h3>Bike station info:</h3>' +
        '<h4>Address:</h4>' + this.bikeStations[i].address + '<h4>Available bikes:</h4>' + this.bikeStations[i].availableBikes +
        '<h4>Available docks:</h4>' + this.bikeStations[i].freeDocks + '<h4>Reservations:</h4>' + this.bikeStations[i].reservations);
    }
    var bikeStations = L.layerGroup(this.markers).addTo(mapLeaflet);
  }


  getBikeAccidents() {
    this.bikeAccidentService.getBikeAccidents().subscribe(
      data => {
        console.log(data)
        //@ts-ignore
        for (let i = 0; i < data.length; i++) {
          let coordsArray = new Array;
          let lng = parseFloat(data[i].accidentPoint.substring(7, 15).trim());
          let lat = parseFloat(data[i].accidentPoint.substring(15, data[i].accidentPoint.length - 1).trim());
          coordsArray.push(lat);
          coordsArray.push(lng);
          coordsArray.push(25);
          this.accidentsLocationArray.push(coordsArray);
        }
        this.accidentsheatMap = L.heatLayer(this.accidentsLocationArray, {
          blur: 20,
          // maxZoom: 19, 
          // gradient: {0.1: 'blue', 0.2: 'lime', 0.4: 'yellow', 0.6: 'yellow', 1: 'red'}
        }).addTo(mapLeaflet);
      }
    )
  }

  hideHeatMap() {
    mapLeaflet.removeLayer(this.accidentsheatMap);

  }

  openTableDetail() {
    const dialogRef = this.dialog.open(TabledetailComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
         console.log(result)
       });
  }

  detectDevice(){
   
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
      this.mapService.sendDevice(check);
    ;
  }
}
