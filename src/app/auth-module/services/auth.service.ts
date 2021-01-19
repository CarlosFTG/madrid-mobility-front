import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private REST_API_SERVER = "http://localhost:8081/api/auth/EMTServices/";
  private REST_API_SERVER = "https://floating-reef-24535.herokuapp.com/api/auth/EMTServices/";

  constructor(private httpClient: HttpClient) { }

  private emtTokenOut = new BehaviorSubject<string>(null);

  emtToken$ = this.emtTokenOut.asObservable();

  private userTokenOut = new BehaviorSubject<string>(null);

  userToken$ = this.userTokenOut.asObservable();

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
        this.httpClient.post('http://localhost:8081/api/auth/EMTServices/getUserToken',params).subscribe(
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

  registerUser(registerParams){
    this.httpClient.post('http://localhost:8082/api/register', registerParams).subscribe(
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
}
