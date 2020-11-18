import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoCardService {

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";

  private closetsStationsListOut = new BehaviorSubject<any[]>(null);
  private iconOut = new BehaviorSubject<any[]>(null);
  private zoomToOut = new BehaviorSubject<any[]>(null);

  notifyClosestsStations$ = this.closetsStationsListOut.asObservable();
  sendFoundAdressIconToMap$ = this.iconOut.asObservable();
  zoomTo$ = this.zoomToOut.asObservable();

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  

  getClosestsStations(params): Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER+'findClosestStations', params).pipe(catchError(this.handleError));
  }

  getAdressCoordinates(address: string){
    return this.httpClient.get('https://www.mapquestapi.com/geocoding/v1/address?key=rap9nA00BZ9zIZLP1eWHyyyrRkqGdFVX&location=' + address).pipe(catchError(this.handleError));
  }

  notifyClosestStations(closetsStations: any) {
    this.closetsStationsListOut.next(closetsStations);
  }

  sendFoundAdressIconToMap(icon: any) {
    this.iconOut.next(icon);
  }

  zoomTo(userPosition: any) {
    this.zoomToOut.next(userPosition);
  }
}
