import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private httpClient: HttpClient) { }

  getBusStops(){

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accessToken': this.basic });
      let options = { headers: headers };

    this.httpClient.post('https://openapi.emtmadrid.es/v1/transport/busemtmad/stops/list/', null, options
    
    )

  }
}
