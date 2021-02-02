import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private REST_API_SERVER = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getFreeParkingPlaces(params):Observable<any>{
    return this.httpClient.post(this.REST_API_SERVER+'checkIfUserInParking', params).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
      } else {
        console.log(error)
        return throwError(error);
      }
    }));
  }
}
