import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StreetsService {

  private streets;

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";

  private streetsListOut = new BehaviorSubject<any[]>(null);

  streetsList$ = this.streetsListOut.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getStreets().subscribe(data =>{
      this.notifyStreets(data)
    })
   }

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

  getStreets(): Observable<any>{
   this. streets=  this.httpClient.get('http://localhost:8081/api/EMTServices/getStreets').pipe(catchError(this.handleError));
    //return this.httpClient.get(this.REST_API_SERVER+'getStreets').pipe(catchError(this.handleError));
    return this.streets;
  }

  notifyStreets(streets){
    this.streetsListOut.next(streets);
  }
}
