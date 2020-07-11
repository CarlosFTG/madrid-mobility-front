import { Component, OnInit, Inject, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { LoaadingNearStationsComponent } from '../loaading-near-stations/loaading-near-stations.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NomadriddialogComponent } from '../nomadriddialog/nomadriddialog.component';
import { ErrordialogComponent } from '../errordialog/errordialog.component';
import { LegendComponent } from '../legend/legend.component';
import {TabledetailComponent} from '../tabledetail/tabledetail.component'
import {BikeAccidentService} from '../../services/bike-accident.service'

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
  positionCompositionForm: FormGroup;
  userPosition;
  varmap: MatExpansionPanel;
  nearestBikeStations: any = new Array;
  streets: any = new Array;
  selectedStation: any;
  
  checked = false;
  disabled = false;
  bikeStations = new Array;
  errorNumberResults = false;
  loadCompleted: boolean = false;
  //sliderPosition:boolean=true;
  filteredStreets: Observable<String[]>
  myForm: FormGroup;
  addressFinderControl = new FormControl();
  globalLatlng: object = new Object();
  markers: any[] = new Array;
  markerIcon: any;
  markerGroup: any;
  iconSize: any;
  showDocks: boolean = false;
  zoomButtontext: String = 'Zoom to my position'
  accidentsLocationArray = new Array;
  accidentsheatMap: any;
  /* @ViewChild("mapAccordeon", { static: true }) mapAccordeon: MatExpansionPanel;
  @ViewChild("detail", { static: true }) detail: MatExpansionPanel; */
  @ViewChild("noMadridDialog", { static: true }) noMadridDialog: NomadriddialogComponent;
  @ViewChild("tabledetailComponent", { static: true }) tabledetailComponent: TabledetailComponent;
  @ViewChild(LegendComponent, { static: true }) legendComponent: LegendComponent;
  constructor(private _http: HttpClient, private fb: FormBuilder, public dialog: MatDialog, private bikeAccidentService:BikeAccidentService) {
    this.filteredStreets = this.addressFinderControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterAdress(value))

      );

  }
  dialogRef = this.dialog;
  dialogCalculatingNearStations = this.dialog;

  ngOnInit() {
    mapLeaflet = L.map('mapLeaflet').setView([40.4167754, -3.7037902], 13);

   // L.tileLayer('https://wms.qgiscloud.com/CarlosFTG/accidents_heatmap/').addTo(mapLeaflet);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 13
    }).addTo(mapLeaflet);

    L.control({ position: 'bottomright' });
    //this.getBikeAccidents();
    this.getInfo();
    this.getStreets();
    this.createForm();
    this.createAddressForm();
    this.getUserPosition();
    this.openDialog();
    //this.getDistricts();
    
    this.iconSize = [20, 51];

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


  createForm() {
    this.positionCompositionForm = new FormGroup({
      'numberOfResults': new FormControl(),
    });
  }

  createAddressForm() {
    this.myForm = new FormGroup({
      firstName: new FormControl()
    });
  }
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
          }
        }
      )

      return globalLatlng;
    });
  }
  async getClosestStation() {
    var re = new RegExp("^[1-9]\d*$");
    if (this.positionCompositionForm.get('numberOfResults').value != null && re.test(this.positionCompositionForm.get('numberOfResults').value)) {
      this.errorNumberResults = false;
      let params = {
        'numberOfResults': parseFloat(this.positionCompositionForm.get('numberOfResults').value),
        //@ts-ignore
        'coordinates': 'POINT (' + this.globalLatlng.lat + ' ' + this.globalLatlng.lng + '),3857)'
      }
      //const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations', params).toPromise();
       const data = await this._http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/findClosestStations', params).toPromise();

      this.openCalculatingNearStationsDialog();
      //@ts-ignore
      if (data.length > 0) {
        this.nearestBikeStations = data;
        let nearestBikeStations = JSON.stringify(this.nearestBikeStations);
        sessionStorage.setItem('nearBikeStations',nearestBikeStations)
        let lat = this.nearestBikeStations[0].pointsList.coordinates.substring(0, this.nearestBikeStations[0].pointsList.coordinates.indexOf(" "));
        let lng = this.nearestBikeStations[0].pointsList.coordinates.substring(this.nearestBikeStations[0].pointsList.coordinates.indexOf(" ") + 1, this.nearestBikeStations[0].pointsList.coordinates.length);

        this.positionCompositionForm.get('numberOfResults').reset();
        this.dialogCalculatingNearStations.closeAll();
        this.dialogCalculatingNearStations.ngOnDestroy();
        const dialogRef = this.dialog.open(TabledetailComponent, {
          width: '600px',
    
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result)
        });
        //this.detail.open();
      } else {

        this.openErrorDialog();
      }

    } else {
      this.errorNumberResults = true;
      this.positionCompositionForm.get('numberOfResults').reset();
    }

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
      this.legendComponent.setBikeOrDot('docks');
    } else {
      this.showDocks = false;
      this.markerGroup.clearLayers();
      this.putBikeStationsOnMap(myIcon);
      this.legendComponent.setBikeOrDot('bikes');
    }
  }

  _filterAdress(value: string): any[] {
    const filterValue = value;
    let resultF: any[];
    if (filterValue.length > 8) {
      if (this.streets) {
        resultF = this.streets.filter(street => {
          if (street.wholeAddress != null) {
            return street.wholeAddress.toLowerCase().includes(filterValue);
          } else {
            return false;
          }
        })
      } else {
        return null;
      }
    }
    return resultF;
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

  async getStreets() {
    //const data = await this._http.get('http://localhost:8081/api/EMTServices/getStreets').toPromise();
    const data = await this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/getStreets').toPromise();
    this.streets = data;

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

  onChangeStreet(event: any) {
    let address = event.option.value;
    var matches = address.match(/(\d+)/);
    let streetWithOutNumber = address.substring(0, matches.index).trim() + '+';
    let addressSplitted = address.split(" ");
    streetWithOutNumber += addressSplitted[0]
    let cleanStreet = streetWithOutNumber.substring(streetWithOutNumber.indexOf(' '), streetWithOutNumber.length)
    address = matches[0] + ',' + cleanStreet + ',madrid,spain';

    //replace *****with you api key
    this._http.get('https://www.mapquestapi.com/geocoding/v1/address?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + address).subscribe(
      res => {

        var myIcon = L.icon({
          iconSize: [41, 51],
          iconAnchor: [20, 51],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],

          shadowAnchor: [22, 94]
        });
        myIcon.options.iconUrl = 'assets/leaflet/point.png';
        //@ts-ignore
        marker = L.marker([res.results[0].locations[0].latLng.lat, res.results[0].locations[0].latLng.lng], {
          icon: myIcon, clickable:
            true, draggable: 'false'
        }).addTo(mapLeaflet);
        //@ts-ignore
        mapLeaflet.setView([res.results[0].locations[0].latLng.lat, res.results[0].locations[0].latLng.lng], 22);
        //@ts-ignore
        this.globalLatlng.lat=res.results[0].locations[0].latLng.lat;
        //@ts-ignore
        this.globalLatlng.lng=res.results[0].locations[0].latLng.lng;
        console.log(this.globalLatlng)
      }, err => {
        console.log(err)
      }
    )
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
  zoomTo() {
    

    if(this.zoomButtontext === 'Zoom to my position'){
      this.zoomButtontext = 'Zoom global'
      //@ts-ignore
      mapLeaflet.setView([this.globalLatlng.lng,this.globalLatlng.lat ], 22);
    }else{
      this.zoomButtontext = 'Zoom to my position'
      mapLeaflet.setView([40.4167754, -3.7037902], 13);
    }
  }

  getBikeAccidents(){
    this.bikeAccidentService.getBikeAccidents().subscribe(
      data =>{
        //@ts-ignore
        for(let i=0; i < data.length;i++){
          let coordsArray = new Array;
          let lng =parseFloat( data[i].accidentPoint.substring(7,15).trim());
          let lat = parseFloat( data[i].accidentPoint.substring(15,data[i].accidentPoint.length-1).trim());
          coordsArray.push(lat);
          coordsArray.push(lng);
          coordsArray.push(25);
         this. accidentsLocationArray.push(coordsArray);
        }
      this.accidentsheatMap =  L.heatLayer(this.accidentsLocationArray, {
          blur: 20, 
         // maxZoom: 19, 
         // gradient: {0.1: 'blue', 0.2: 'lime', 0.4: 'yellow', 0.6: 'yellow', 1: 'red'}
        }).addTo(mapLeaflet);
      }
    )
  }

  hideHeatMap(){
    mapLeaflet.removeLayer(this.accidentsheatMap);
    
  }
}
