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
    public dialog: MatDialog){

  }

  ngOnInit() {
    this.mapService.renderMap();
    this.openLoading();
  }

  detectZoomChange(){

  }

  selectOnMap(){
    let bikeStationsLayerIndex;
    let dialog = this.dialog;
    for(let i = 0; i < this.mapService.map$.getLayers().getArray().length;i++){
      if(this.mapService.map$.getLayers().getArray()[i].values_.name === 'bikeStations'){
        bikeStationsLayerIndex=i;
      }
    }
    let targetLayer = this.mapService.map$.getLayers().getArray()[bikeStationsLayerIndex];
    
     let select = new Select({
       layers: [targetLayer],
       //style:selectStyle
     });
     
      select.getFeatures().on('change:length', function (e) {
        var feature_buff = select.getFeatures();
        if(feature_buff.getLength() >0){
            for (var i = 0; i < feature_buff.getLength(); i++) {
              const dialogRef = dialog.open(InfoPopupComponent, {
                width: '600px',
              });
              dialogRef.componentInstance.totalBikes = feature_buff.item(0).values_.availableBikes;
              dialogRef.componentInstance.availableSlots = feature_buff.item(0).values_.availableSlots;
              dialogRef.componentInstance.name = feature_buff.item(0).values_.name;
              dialogRef.componentInstance.address = feature_buff.item(0).values_.address;
              dialogRef.componentInstance.updatedAt = feature_buff.item(0).values_.updatedAt;
            }
          
          //detecta cuando no se hace click sobre alguna feature
        }else{
          // vehiclesRoutesService.openInfoCard(null);
          // sharedService.updateVehicleSelection(null);
        }
         
      });
      if(this.selectIndex <1){
        this.selectIndex++;
        this.mapService.map$.addInteraction(select);
      }
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
