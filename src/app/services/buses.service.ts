import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  private busesListOut = new BehaviorSubject<any[]>(null);
  notifyBuses$ = this.busesListOut.asObservable();

  constructor(private httpClient: HttpClient) {
    //unavailable by now
    //this.getBusStops();
    this.getBusStopsAroundUser();
   }

  getBusStops(){

    this.httpClient.get('http://localhost:8081/api/EMTServices/getBusStops').subscribe(
      res=>{
        console.log(res)
      }
    )

  }

  getBusStopsAroundUser(){

    let lng = sessionStorage.getItem('userLng');
    let lat = sessionStorage.getItem('userLat');

    this.httpClient.get('http://localhost:8081/api/EMTServices/getBusStopsAroundUser', {
      params: {
        'lngStr': lng,
        'latStr': lat,
      }
    }).subscribe(
      res=>{
        this.notifyBuses(res);
      },
      err =>{
      }
    )

  }

  notifyBuses(busStops: any) {
    this.busesListOut.next(busStops);
  }
}
