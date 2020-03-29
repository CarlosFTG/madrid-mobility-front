import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material/expansion'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';

export interface DialogData {
  animal: string;
  name: string;
}

declare let L;
var marker;
var userMarker;
var biciMadPerimeter;
let map;


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  positionCompositionForm: FormGroup;
   userPosition;
   varmap:MatExpansionPanel;
   nearestBikeStations:any=new Array;
   selectedStation: any;
   cols: any[];
   checked = false;
  disabled = false;
  bikeStations= new Array;
  errorNumberResults=false;
   //sliderPosition:boolean=true;
   @ViewChild("map",{static:true}) map:MatExpansionPanel;
 @ViewChild("detail",{static:true}) detail:MatExpansionPanel;
  constructor(private _http: HttpClient, private fb: FormBuilder,public dialog: MatDialog) { }


  ngOnInit() {
     map = L.map('map').setView([40.4167754,-3.7037902], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        this.getInfo();
        this.createForm();
        this.getUserPosition();
        this.createUserLocationPoint();
        this.openDialog()

        this.cols = [
          { field: 'address', header: 'Address' },
          { field: 'availableBikes', header: 'Available bikes' },
          { field: 'freeDocks', header: 'Free docks' },
          { field: 'reservations', header: 'Reservations' }
      ];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      //data: {name: this.name, animal: this.animal}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

  createForm(){
    this.positionCompositionForm = new FormGroup({
      'numberOfResults': new FormControl()
    });
  }


getUserPosition(){
  this.userPosition=navigator.geolocation.getCurrentPosition(getPosition);

  function getPosition(position){
    let userLocationPoint={'lat':position.coords.latitude, 'lng':position.coords.longitude}
    sessionStorage.setItem('lat',position.coords.latitude)
    sessionStorage.setItem('lng',position.coords.longitude)
    
  }
}

async getClosestStation(){
  var re = new RegExp("^[1-9]\d*$");
  if(this.positionCompositionForm.get('numberOfResults').value!=null && re.test(this.positionCompositionForm.get('numberOfResults').value) ){
    this.errorNumberResults=false;
    let params={
      'numberOfResults':parseFloat(this.positionCompositionForm.get('numberOfResults').value),
      'coordinates':'POINT ('+sessionStorage.getItem('lng')+' '+sessionStorage.getItem('lat')+'),3857)'
    }
  
    const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations',params).toPromise();
    if(data){
     this.nearestBikeStations=data;
     let lat=this.nearestBikeStations[0].pointsList.coordinates.substring(0,this.nearestBikeStations[0].pointsList.coordinates.indexOf(" "));
     let lng=this.nearestBikeStations[0].pointsList.coordinates.substring(this.nearestBikeStations[0].pointsList.coordinates.indexOf(" ")+1,this.nearestBikeStations[0].pointsList.coordinates.length);
    
     this.positionCompositionForm.get('numberOfResults').reset();
     this.detail.open();
    }else{
  
    }

  }else{
    this.errorNumberResults=true;
    this.positionCompositionForm.get('numberOfResults').reset();
  }
  
}

toggleSlide(event:any){
console.log(event.checked)
var myIcon = L.icon({
  iconSize: [41, 51],
  iconAnchor: [20, 51],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94]
}); 
if(event.checked){
  for(let i=0;i<this.bikeStations.length;i++){
    var lat=this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
    var lng=this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',')+1,this.bikeStations[i].pointsList.coordinates.length );
    //var pointAttributes="Point Id:"+layerStringToJson.properties.id+",  Name:"+layerStringToJson.properties.name;
    /* marker=L.marker(bikeStations[i].pointsList.coordinates,{icon: myIcon,clickable:
      true,draggable:'false',title:pointAttributes}).addTo(this.globals.map)
      .on('click', onClick) */

      if(this.bikeStations[i].freeDocks >0){
        myIcon.options.iconUrl='assets/leaflet/green_dot.jpg'
      }else{
        myIcon.options.iconUrl='assets/leaflet/red_dot.png'
      }
      var coordsArray=new Array;
      coordsArray.push(lng);coordsArray.push(lat);
      marker=L.marker(coordsArray,{icon: myIcon,clickable:
        true,draggable:'false'}).addTo(map);
  }
}else{
  for(let i=0;i<this.bikeStations.length;i++){
    var lat=this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
    var lng=this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',')+1,this.bikeStations[i].pointsList.coordinates.length );
    //var pointAttributes="Point Id:"+layerStringToJson.properties.id+",  Name:"+layerStringToJson.properties.name;
    /* marker=L.marker(bikeStations[i].pointsList.coordinates,{icon: myIcon,clickable:
      true,draggable:'false',title:pointAttributes}).addTo(this.globals.map)
      .on('click', onClick) */

      if(this.bikeStations[i].availableBikes >0){
        myIcon.options.iconUrl='assets/leaflet/green_bike.png'
      }else{
        myIcon.options.iconUrl='assets/leaflet/red_bike.png'
      }
      var coordsArray=new Array;
      coordsArray.push(lng);coordsArray.push(lat);
      marker=L.marker(coordsArray,{icon: myIcon,clickable:
        true,draggable:'false'}).addTo(map);
  }
}
}

createUserLocationPoint(){
  var myIcon = L.icon({
    iconSize: [41, 51],
    iconAnchor: [20, 51],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  }); 
console.log(sessionStorage.getItem('lat'))
  myIcon.options.iconUrl='assets/leaflet/marker-icon.png'
  userMarker=L.marker([sessionStorage.getItem('lat'),sessionStorage.getItem('lng')],{icon: myIcon,clickable:
    true,draggable:'false'}).addTo(map);
}

async findNearStations(select:any){
  let lat=select.pointsList.coordinates.substring(0,select.pointsList.coordinates.indexOf(" "));
   let lng=select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ")+1,select.pointsList.coordinates.length);
   map.setView([lng,lat], 20);
  this.map.open();
}

getBackToMap(){
  this.map.open()
}

getInfo(){
  this._http.get('http://localhost:8081/api/EMTServices/checkAvaibility').subscribe(
        res =>{

          var myIcon = L.icon({
            iconSize: [41, 51],
            iconAnchor: [20, 51],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          }); 
          
          //let bikeStations= new Array;

          for(let i=0;i<214;i++){
            this.bikeStations.push(res[i]);
          }
          for(let i=0;i<this.bikeStations.length;i++){
            var lat=this.bikeStations[i].pointsList.coordinates.substring(0, this.bikeStations[i].pointsList.coordinates.indexOf(','));
            var lng=this.bikeStations[i].pointsList.coordinates.substring(this.bikeStations[i].pointsList.coordinates.indexOf(',')+1,this.bikeStations[i].pointsList.coordinates.length );
            //var pointAttributes="Point Id:"+layerStringToJson.properties.id+",  Name:"+layerStringToJson.properties.name;
            /* marker=L.marker(bikeStations[i].pointsList.coordinates,{icon: myIcon,clickable:
              true,draggable:'false',title:pointAttributes}).addTo(this.globals.map)
              .on('click', onClick) */

              if(this.bikeStations[i].availableBikes >0){
                myIcon.options.iconUrl='assets/leaflet/green_bike.png'
              }else{
                myIcon.options.iconUrl='assets/leaflet/red_bike.png'
              }
              var coordsArray=new Array;
              coordsArray.push(lng);coordsArray.push(lat);
              marker=L.marker(coordsArray,{icon: myIcon,clickable:
                true,draggable:'false'}).addTo(map);
          }
          
    },err=>{
    });
}
}

/* 
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class Dialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
     ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

} */