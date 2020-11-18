import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
//import { AuthService } from './services/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  

  //constructor(public authService: AuthService) { }
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=localStorage.getItem('JWT_TOKEN');
    // if (this.authService.getJwtToken()) {
       request = this.addToken(request, token);
    // }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        //return this.handle401Error(request, next);
      } else {
        console.log(error)
        return throwError(error);
      }
    }));
  }

   private addToken(request: HttpRequest<any>, token: string) {
     return request.clone({
       setHeaders: {
         'Authorization': `Bearer ${token}`
       }
     });
   }
}