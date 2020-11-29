import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { RoutesService } from 'src/app/services/routes.service';
import { InfoCardService } from '../../info-card/services/info-card.service';

@Component({
  selector: 'app-tabledetail',
  templateUrl: './tabledetail.component.html',
  styleUrls: ['./tabledetail.component.css']
})
export class TabledetailComponent implements OnInit {
  nearestBikeStations: any = new Array;
  cols: any[];
  selectedStation: any;
  closetsStation: any;
  constructor(private infoCardService: InfoCardService, private mapService : MapService, private routeService: RoutesService) { }

  ngOnInit(): void {
    this.infoCardService.notifyClosestsStations$.subscribe(closetsStations => {
      if (closetsStations != null) {
         this.closetsStation = closetsStations;
      }
    });
    this.cols = [
      { field: 'address', header: 'Address' },
      { field: 'availableBikes', header: 'Available bikes' },
      { field: 'freeDocks', header: 'Free docks' },
      { field: 'reservations', header: 'Reservations' },
      { field: 'distance', header: 'Distance' }
    ];
  }
  async findNearStations(select: any) {
    let lat = select.pointsList.coordinates.substring(0, select.pointsList.coordinates.indexOf(" "));
    let lng = select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ") + 1, select.pointsList.coordinates.length);
    let setViewPoint = 'POINT(' + lat + ' ' + lng+ ')';
    this.routeService.getRoute(select.address);
    this.mapService.updateMapViewCenter(setViewPoint);
  }

  getBackToMap() {
    //this.mapAccordeon.open()
  }
}
