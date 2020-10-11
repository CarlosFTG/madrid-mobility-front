import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { IBikeAccident } from '../models/interfaces';
import { BikeAccident } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class BikeAccidentService {

  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/EMTServices/";

  private bikeAccidents;

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

  public getBikeAccidents(): Observable<any[]>{

    if(!this.bikeAccidents){
      this.bikeAccidents =this.httpClient.get(this.REST_API_SERVER+'getBikeAccidents').pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError(this.handleError));
    }
    return this.bikeAccidents;
  }

//   getGitProjects(): void {
//     this.projects$ = this.http.get<GitProject[]>(this.gitBaseUrl).pipe(
//       map(projects =>
//         projects.filter(project => this.gitProjects.includes(project.name))
//       ),
//       // publishReplay(1),
//       // refCount(),
//       shareReplay({ bufferSize: 1, refCount: true }),
//       catchError(error => captureException(error))
//     ) as Observable<GitProject[]>
// }
}
