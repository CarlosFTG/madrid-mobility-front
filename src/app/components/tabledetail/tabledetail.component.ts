import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MapService } from 'src/app/services/map.service';
import { RoutesService } from 'src/app/services/routes.service';
import { InfoCardService } from '../../info-card/services/info-card.service';
import { TabledetailService } from './services/tabledetail.service';

@Component({
  selector: 'app-tabledetail',
  templateUrl: './tabledetail.component.html',
  styleUrls: ['./tabledetail.component.css']
})
export class TabledetailComponent implements OnInit {
  displayedColumns: string[] = ['address', 'name', 'availableBikes', 'freeDocks','distance'];
  selectedStation: any;
  closetsStation: any;
  dataSource;
  updatedAt: Date;
  languageEN: boolean;
  constructor(private infoCardService: InfoCardService,
     private mapService : MapService, 
    private routeService: RoutesService,
    public dialogRef: MatDialogRef<TabledetailComponent>,
    private tabledetailService:TabledetailService) { }

  ngOnInit(): void {
    this.infoCardService.notifyClosestsStations$.subscribe(closetsStations => {
      if (closetsStations != null) {
         this.closetsStation = closetsStations;
         this.dataSource = closetsStations;
         this.updatedAt = this.dataSource[0].updatedAt
      }
    });

    this.getLanguage();
  }
  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
    }else{
      this.languageEN = true;
    }
  }

  async findNearStations(select: any) {
    let latBikeStation = select.pointsList.coordinates.substring(0, select.pointsList.coordinates.indexOf(" "));
    let lngBikeStation = select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ") + 1, select.pointsList.coordinates.length);

    let bikeStationCoords = {
      lat:latBikeStation,
      lng:lngBikeStation
    }

    let userCoords = {
      lat: JSON.parse(localStorage.getItem('userCoords')).lat,
      lng:JSON.parse(localStorage.getItem('userCoords')).lng
    }
    let setViewPoint = 'POINT(' + latBikeStation + ' ' + lngBikeStation+ ')';
    this.tabledetailService.notifySelectedStationId(select.stationId);
    this.routeService.getRoute(userCoords,bikeStationCoords).subscribe(
      res=>{
        this.routeService.createRouteLayer(res.features[0].geometry.coordinates);
        let index=Math.round(res.features[0].geometry.coordinates.length/2);
        let setViewPoint = 'POINT(' +res.features[0].geometry.coordinates[index][0] + ' ' + res.features[0].geometry.coordinates[index][1]+ ')';
        this.mapService.updateMapViewCenter(setViewPoint, 16);
    }, err=>{
      console.log(err)
    });
    this.closeDialog();
    this.mapService.updateMapViewCenter(setViewPoint);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getBackToMap() {
    //this.mapAccordeon.open()
  }
}
