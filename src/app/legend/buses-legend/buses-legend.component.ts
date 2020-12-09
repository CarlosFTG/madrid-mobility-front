import { Component, OnInit } from '@angular/core';
import { BusesService } from 'src/app/services/buses.service';

@Component({
  selector: 'app-buses-legend',
  templateUrl: './buses-legend.component.html',
  styleUrls: ['./buses-legend.component.css']
})
export class BusesLegendComponent implements OnInit {

  busStops: any[];

  constructor(private busesService: BusesService) {
    this.busesService.notifyBuses$.subscribe(busStops => {
      if (busStops != null) {
         this.busStops = busStops;
      }
    });
   }

  ngOnInit(): void {
    
  }

}
