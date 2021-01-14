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
      }
    });
  }
  async findNearStations(select: any) {
    let lat = select.pointsList.coordinates.substring(0, select.pointsList.coordinates.indexOf(" "));
    let lng = select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ") + 1, select.pointsList.coordinates.length);
    let setViewPoint = 'POINT(' + lat + ' ' + lng+ ')';
    this.tabledetailService.notifySelectedStationId(select.stationId);
    this.routeService.getRoute(select.address);
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
