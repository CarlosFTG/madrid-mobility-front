import { Component, OnInit } from '@angular/core';
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
  constructor(private infoCardService: InfoCardService) { }

  ngOnInit(): void {
    this.infoCardService.sendClosestsStationsToMap$.subscribe(closetsStations => {
      if (closetsStations != null) {
        // console.log(closetsStations)
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
    /* let lat = select.pointsList.coordinates.substring(0, select.pointsList.coordinates.indexOf(" "));
    let lng = select.pointsList.coordinates.substring(select.pointsList.coordinates.indexOf(" ") + 1, select.pointsList.coordinates.length);
    mapLeaflet.setView([lng, lat], 20); */
    //this.mapAccordeon.open();
  }

  getBackToMap() {
    //this.mapAccordeon.open()
  }
}
