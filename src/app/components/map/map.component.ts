import { Component, OnInit, Inject, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { MatExpansionPanel } from '@angular/material/expansion'
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { LoaadingNearStationsComponent } from '../loaading-near-stations/loaading-near-stations.component';

import { NomadriddialogComponent } from '../nomadriddialog/nomadriddialog.component';
import { ErrordialogComponent } from '../errordialog/errordialog.component';
import { TabledetailComponent } from '../tabledetail/tabledetail.component'
import { BikeAccidentService } from '../../services/bike-accident.service'
import { InfoCardService } from '../../info-card/services/info-card.service';
import { MapService } from '../../services/map.service';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { UserService } from 'src/app/services/user.service';
import { DistrictsService } from 'src/app/services/districts.service';
import { BusesService } from 'src/app/services/buses.service';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private mapService: MapService, 
    private bikesLayerService: BikesLayerService, 
    private userService:UserService, 
    private districtsService: DistrictsService, 
    private busesService: BusesService,
    public dialog: MatDialog){

  }

  ngOnInit() {
    this.mapService.renderMap();
    //console.log(this.mapService.map$)
    this.openLoading();
  }

  detectZoomChange(){

  }

  selectOnMap(event){
    
  }

  openLoading() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
       });
  }
}
