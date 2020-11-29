import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private httpClient: HttpClient) { }

  getRoute(selectedBikeStationAddress: string){
    let userPosition = localStorage.getItem('userLocationAddress');
    // console.log(userPosition)
    // console.log(selectedBikeStationAddress)
    // http://www.mapquestapi.com/directions/v2/route?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA
    // this.httpClient.get('http://open.mapquestapi.com/directions/v2/route?key=KEY&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA').subscribe(
    //    data=>{
    //      console.log(data)
    //    },
    //    err => {
    //      console.log(err)
    //    }
    //  )


  }
}
