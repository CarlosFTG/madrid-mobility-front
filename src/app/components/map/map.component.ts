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
import { BikeStationInfoComponent } from '../bike-station-info/bike-station-info.component';


declare let L;
var marker;
let mapLeaflet;
//var globalLatlng
var polygon
var userCity;
var legend


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
  cols: any[];
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
  @ViewChild("mapAccordeon", { static: true }) mapAccordeon: MatExpansionPanel;
  @ViewChild("detail", { static: true }) detail: MatExpansionPanel;
  @ViewChild("noMadridDialog", { static: true }) noMadridDialog: NomadriddialogComponent;

  constructor(private _http: HttpClient, private fb: FormBuilder, public dialog: MatDialog) {
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapLeaflet);
    L.control({position: 'bottomright'});
    this.getInfo();
    this.getStreets();
    this.createForm();
    this.createAddressForm();
    this.getUserPosition();
    //this.openDialog();

    this.cols = [
      { field: 'address', header: 'Address' },
      { field: 'availableBikes', header: 'Available bikes' },
      { field: 'freeDocks', header: 'Free docks' },
      { field: 'reservations', header: 'Reservations' },
      { field: 'distance', header: 'Distance' }
    ];


  }

  openWelcomeDialog(): void {
    const dialogRef = this.dialog.open(LoaadingNearStationsComponent, {
      width: '600px',

    });
    dialogRef.afterClosed().subscribe(result => {
    });
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

  displayFn(objectSelected: any): any {
    return (objectSelected && objectSelected.wholeAddress ? objectSelected.wholeAddress : '');
  }

  onChangeStreet(event: any) {
    let address = event.option.value;
    var matches = address.match(/(\d+)/);
    let streetWithOutNumber = address.substring(0, matches.index).trim() + '+';
    let addressSplitted = address.split(" ");
    streetWithOutNumber+=addressSplitted[0]
    let cleanStreet=streetWithOutNumber.substring(streetWithOutNumber.indexOf(' '),streetWithOutNumber.length)
    address=matches[0]+','+cleanStreet+',madrid,spain';
    
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
      marker = L.marker([res.results[0].locations[0].latLng.lat,res.results[0].locations[0].latLng.lng], {
        icon: myIcon, clickable:
          true, draggable: 'false'
      }).addTo(mapLeaflet);
      //@ts-ignore
      mapLeaflet.setView([res.results[0].locations[0].latLng.lat,res.results[0].locations[0].latLng.lng], 22); 
    }, err => {
      console.log(err)
    }
    )
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
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
          //http.post('http://localhost:8081/api/EMTServices/registerVisit',userCity).subscribe();
         http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/registerVisit',userCity).subscribe();
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
              this.openDialog();

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

            mapLeaflet.setView(latlng, 22);
            //@ts-ignore
            globalLatlng.lng = latlng.lat;
            //@ts-ignore
            globalLatlng.lat = latlng.lng;
            this.openDialog();
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
     // const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations', params).toPromise();
       const data = await this._http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/findClosestStations', params).toPromise();
      //@ts-ignore
      if (data.length>0) {
        this.openCalculatingNearStationsDialog()
        this.nearestBikeStations = data;
        let lat = this.nearestBikeStations[0].pointsList.coordinates.substring(0, this.nearestBikeStations[0].pointsList.coordinates.indexOf(" "));
        let lng = this.nearestBikeStations[0].pointsList.coordinates.substring(this.nearestBikeStations[0].pointsList.coordinates.indexOf(" ") + 1, this.nearestBikeStations[0].pointsList.coordinates.length);

        this.positionCompositionForm.get('numberOfResults').reset();
        this.dialogCalculatingNearStations.closeAll();
        this.dialogCalculatingNearStations.ngOnDestroy();
        this.detail.open();
      } else {
        const dialogRef = this.dialog.open(LoaadingNearStationsComponent, {

        }).close();
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
      iconSize: [41, 51],
      iconAnchor: [20, 51],
      popupAnchor: [-3, -76],
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
    });
    if (event.checked) {
      for (let i = 0; i < this.bikeStations.length; i++) {
        var lat = this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
        var lng = this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',') + 1, this.bikeStations[i].pointsList.coordinates.length);


        if (this.bikeStations[i].freeDocks > 0) {
          myIcon.options.iconUrl = 'assets/leaflet/green_dot.jpg'
        } else {
          myIcon.options.iconUrl = 'assets/leaflet/red_dot.png'
        }
        var coordsArray = new Array;
        coordsArray.push(lng); coordsArray.push(lat);
        marker = L.marker(coordsArray, {
          icon: myIcon, clickable:
            true, draggable: false
        }).addTo(mapLeaflet);
      }
    } else {
      for (let i = 0; i < this.bikeStations.length; i++) {
        var lat = this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
        var lng = this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',') + 1, this.bikeStations[i].pointsList.coordinates.length);


        if (this.bikeStations[i].availableBikes > 0) {
          myIcon.options.iconUrl = 'assets/leaflet/green_bike.png'
        } else {
          myIcon.options.iconUrl = 'assets/leaflet/red_bike.png'
        }
        var coordsArray = new Array;
        coordsArray.push(lng); coordsArray.push(lat);
        marker = L.marker(coordsArray, {
          icon: myIcon, clickable:
            true, draggable: 'false'
        }).addTo(mapLeaflet);
      }
    }
  }

  async findNearStations(select: any) {
    let lat = select.pointsList.coordinates.substring(0, select.pointsList.coordinates.indexOf(" "));
    let lng = select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ") + 1, select.pointsList.coordinates.length);
    mapLeaflet.setView([lng, lat], 20);
    this.mapAccordeon.open();
  }

  getBackToMap() {
    this.mapAccordeon.open()
  }

  getInfo() {
    //this._http.get('http://localhost:8081/api/EMTServices/checkAvaibility').subscribe(
       this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/checkAvaibility').subscribe(
      res => {

        var myIcon = L.icon({
          iconSize: [41, 51],
          iconAnchor: [20, 51],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        });

        //let bikeStations= new Array;

        for (let i = 0; i < 214; i++) {
          this.bikeStations.push(res[i]);
        }
        for (let i = 0; i < this.bikeStations.length; i++) {
          var lat = this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
          var lng = this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',') + 1, this.bikeStations[i].pointsList.coordinates.length);


          if (this.bikeStations[i].availableBikes > 0) {
            myIcon.options.iconUrl = 'assets/leaflet/green_bike.png'
          } else {
            myIcon.options.iconUrl = 'assets/leaflet/red_bike.png'
          }
          var coordsArray = new Array;
          coordsArray.push(lng); coordsArray.push(lat);
          marker = L.marker(coordsArray, {
            icon: myIcon, clickable:
              true, draggable: false
          }).addTo(mapLeaflet).bindPopup('<h3>Bike station info:</h3>'+
          '<h4>Address:</h4>'+this.bikeStations[i].address+'<h4>Available bikes:</h4>'+this.bikeStations[i].availableBikes+
          '<h4>Available docks:</h4>'+this.bikeStations[i].freeDocks+'<h4>Reservations:</h4>'+this.bikeStations[i].reservations);
        }
        //this.dialogRef.closeAll()
        //this.dialogRef.ngOnDestroy();
      }, err => {
      });
  }

  async getStreets() {
    //const data = await this._http.get('http://localhost:8081/api/EMTServices/getStreets').toPromise();
    const data = await this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/getStreets').toPromise();
    this.streets = data;

  }

 /*  @HostListener('window:beforeunload', ['$event'])
  //@ts-ignore
  beforeUnloadHandler(event) {
    //this._http.get('http://localhost:8081/api/EMTServices/deleteBikeStationRegisters').subscribe();
    this._http.get('floating-reef-24535.herokuapp.com/api/EMTServices/deleteBikeStationRegisters').subscribe();
  } */

}
