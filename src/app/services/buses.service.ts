import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth-module/services/auth.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/buses/EMTServices/";
  //private REST_API_SERVER = "http://localhost:8081/api/buses/EMTServices/";

  token: string;

  userPosition = { 'lat': null, 'lng': null };

  private busesListOut = new BehaviorSubject<any[]>(null);
  notifyBuses$ = this.busesListOut.asObservable();

  constructor(private httpClient: HttpClient,private authService: AuthService, private mapService: MapService) {
    //unavailable by now
    //this.getBusStops();
    this.authService.emtToken$.subscribe(token=>{
      if(token != null){
        this.token = token;
        this.getBusStopsAroundUser();
      }
    });
    this.mapService.sendUserPositionToInfoCard$.subscribe(data => {
      if (data != null) {
        if (typeof (data) === 'object') {
          //@ts-ignore
          this.userPosition.lat = data.lat;
          //@ts-ignore
          this.userPosition.lng = data.lng;
          this.getBusStopsAroundUser();
        } else {
          let fakeAddressSplt = String(data).split(' ');
          //@ts-ignore
          this.userPosition.lat = fakeAddressSplt[1];
          //@ts-ignore
          this.userPosition.lng = fakeAddressSplt[0];
          this.getBusStopsAroundUser();
        }
      }
    })
   }

  getBusStops(){

    //this.httpClient.get(this.REST_API_SERVER+'getBusStops').subscribe(
    this.httpClient.get('http://localhost:8081/api/buses/EMTServices/getBusStops').subscribe(
      res=>{
        console.log(res)
      }
    )

  }

  getBusStopsAroundUser(){

    if(this.token != undefined && this.userPosition.lng != undefined){
      let lng = this.userPosition.lng;
      let lat = this.userPosition.lat;
  
      this.httpClient.get(this.REST_API_SERVER+'getBusStopsAroundUser', {
        params: {
          'emtToken':this.token,
          'lng': lng,
          'lat': lat,
        }
      }).subscribe(
        res=>{
          this.notifyBuses(res);
        },
        err =>{
        }
      )
    }
  }

  notifyBuses(busStops: any) {
    this.busesListOut.next(busStops);
  }
}
