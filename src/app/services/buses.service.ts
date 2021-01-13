import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth-module/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  //private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";
  private REST_API_SERVER = "http://localhost:8081/api/buses/EMTServices/";

  token: string;

  private busesListOut = new BehaviorSubject<any[]>(null);
  notifyBuses$ = this.busesListOut.asObservable();

  constructor(private httpClient: HttpClient,private authService: AuthService) {
    //unavailable by now
    //this.getBusStops();
    this.authService.emtToken$.subscribe(token=>{
      if(token != null){
        this.token = token;
        this.getBusStopsAroundUser();
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

    let lng = sessionStorage.getItem('userLng');
    let lat = sessionStorage.getItem('userLat');

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

  notifyBuses(busStops: any) {
    this.busesListOut.next(busStops);
  }
}
