import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private REST_API_SERVER = "http://localhost:8081/api/auth/EMTServices/";
  private REST_API_SERVER = environment.baseUrl+'auth/EMTServices/';

  constructor(private httpClient: HttpClient) { }

  private emtTokenOut = new BehaviorSubject<string>(null);

  emtToken$ = this.emtTokenOut.asObservable();

  private userTokenOut = new BehaviorSubject<string>(null);

  userToken$ = this.userTokenOut.asObservable();

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

  doLogin(){
    this.httpClient.get(this.REST_API_SERVER+'login').subscribe(
      res=>{
      //@ts-ignore
      if(res.token != null && res.token != undefined){
        //@ts-ignore
        this.notifyToken(res.token)
      }
    },
    err =>{
      console.log(err)
    });
  }

  //calling to indentity service in node
  doLoginUser(loginParams){
    this.httpClient.post('http://localhost:8082/api/login',loginParams).subscribe(
      res=>{    
        //@ts-ignore      
          localStorage.setItem('JWT_TOKEN',res.token );
          let params = {
            //@ts-ignore
            token :res.token
          }
        this.httpClient.post('http://localhost:8081/api/auth/EMTServices/setUserToken',params).subscribe(
          res=>{
            this.notifyUserToken(localStorage.getItem('JWT_TOKEN'));
          }, err=>{
            if(err.statusText === 'OK'){
              this.notifyUserToken(localStorage.getItem('JWT_TOKEN'));
            }
          }
        )
    },
    err =>{
      console.log(err)
    });
  }

  registerUser(userBean){
    this.httpClient.post('http://localhost:8081/api/auth/EMTServices/registerUser', userBean).subscribe(
      res=>{
      console.log(res)
    },
    err =>{
      console.log(err)
    });
  }

  notifyUserToken(token: string){
    this.userTokenOut.next(token);
  }

  notifyToken(token: string){
    this.emtTokenOut.next(token);
  }

  logOut(){
    this.httpClient.post(this.REST_API_SERVER+'logOut', null).subscribe();
  }
}
