import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  private emtTokenOut = new BehaviorSubject<string>(null);

  emtToken$ = this.emtTokenOut.asObservable();

  doLogin(){
    this.httpClient.get('http://localhost:8081/api/EMTServices/login').subscribe(
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

  doLoginUser(loginParams){
    this.httpClient.get('http://localhost:8081/api/EMTServices/loginUser', {
      params: {
        'email': loginParams.email,
        'password': loginParams.password
      }
    }).subscribe(
      res=>{
      console.log(res)
    },
    err =>{
      console.log(err)
    });
  }

  registerUser(registerParams){
    this.httpClient.get('http://localhost:8081/api/EMTServices/registerUser', {
      params: {
        'name':registerParams.name,
        'surname':registerParams.surname,
        'email': registerParams.email,
        'password': registerParams.password
      }
    }).subscribe(
      res=>{
      console.log(res)
    },
    err =>{
      console.log(err)
    });
  }

  notifyToken(token: string){
    this.emtTokenOut.next(token);
  }
}
