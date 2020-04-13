import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { LoaadingNearStationsComponent } from '../loaading-near-stations/loaading-near-stations.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


declare let L;
var marker;
let mapLeaflet;
var globalLatlng


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
  /* geoCoderForm=new FormGroup({
   addressAuto: new FormControl()
 })  */
  myForm: FormGroup;
  addressFinderControl = new FormControl();
  @ViewChild("mapAccordeon", { static: true }) mapAccordeon: MatExpansionPanel;
  @ViewChild("detail", { static: true }) detail: MatExpansionPanel;
  

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
    this.getInfo();
    this.getStreets();
    this.createForm();
    this.createAddressForm();
    this.getUserPosition();
    this.openDialog()

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
    let address=event.option.value;
    var matches = address.match(/(\d+)/);
    //let indexOf=address.indexOf(matches[0])
    let streetWithOutNumber=address.substring(0,matches.index).trim()+'+';
    let addressSplitted = address.split(" ");
    streetWithOutNumber+=addressSplitted[0]
    let cleanStreet=streetWithOutNumber.substring(streetWithOutNumber.indexOf(' '),streetWithOutNumber.length)
    address=matches[0]+','+cleanStreet+',madrid,spain';
    
    
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
  }

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

    navigator.geolocation.getCurrentPosition(function (location) {
      var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

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
      globalLatlng = latlng;
    });
  }
  async getClosestStation() {
    this.openCalculatingNearStationsDialog()
    var re = new RegExp("^[1-9]\d*$");
    if (this.positionCompositionForm.get('numberOfResults').value != null && re.test(this.positionCompositionForm.get('numberOfResults').value)) {
      this.errorNumberResults = false;
      let params = {
        'numberOfResults': parseFloat(this.positionCompositionForm.get('numberOfResults').value),
        'coordinates': 'POINT (' + globalLatlng.lng + ' ' + globalLatlng.lat + '),3857)'
      }
      //const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations', params).toPromise();
      const data = await this._http.post('https://floating-reef-24535.herokuapp.com/api/EMTServices/findClosestStations', params).toPromise();
      if (data) {
        this.nearestBikeStations = data;
        let lat = this.nearestBikeStations[0].pointsList.coordinates.substring(0, this.nearestBikeStations[0].pointsList.coordinates.indexOf(" "));
        let lng = this.nearestBikeStations[0].pointsList.coordinates.substring(this.nearestBikeStations[0].pointsList.coordinates.indexOf(" ") + 1, this.nearestBikeStations[0].pointsList.coordinates.length);

        this.positionCompositionForm.get('numberOfResults').reset();
        this.dialogCalculatingNearStations.closeAll();
        this.dialogCalculatingNearStations.ngOnDestroy();
        this.detail.open();
      } else {

      }

    } else {
      this.errorNumberResults = true;
      this.positionCompositionForm.get('numberOfResults').reset();
    }

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
          }).addTo(mapLeaflet);
        }
        this.dialogRef.closeAll()
        this.dialogRef.ngOnDestroy();
      }, err => {
      });
  }

  async getStreets() {
    //const data = await this._http.get('http://localhost:8081/api/EMTServices/getStreets').toPromise();
    const data = await this._http.get('https://floating-reef-24535.herokuapp.com/api/EMTServices/getStreets').toPromise();
    this.streets = data;

  }
}
