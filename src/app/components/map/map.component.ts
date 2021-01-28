import { Component, OnInit} from '@angular/core';
//import { MatExpansionPanel } from '@angular/material/expansion'
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

import { BikeAccidentService } from '../../services/bike-accident.service'
import { MapService } from '../../services/map.service';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { UserService } from 'src/app/services/user.service';
import { DistrictsService } from 'src/app/services/districts.service';
import { BusesService } from 'src/app/services/buses.service';
import { MatDialog } from '@angular/material/dialog';

import Select from 'ol/interaction/Select';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { LegendService } from 'src/app/legend/services/legend.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  selectIndex: number=0;

  constructor(private mapService: MapService, 
    private bikesLayerService: BikesLayerService, 
    private userService:UserService, 
    private districtsService: DistrictsService, 
    private busesService: BusesService,
    private bikeAccidents: BikeAccidentService,
    public dialog: MatDialog,
    private legendService: LegendService){

  }

  ngOnInit() {
    this.mapService.renderMap();
    this.openLoading();
  }

  detectZoomChange(){

  }

  selectOnMap(){
    this.mapService.selectOnMap();
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
