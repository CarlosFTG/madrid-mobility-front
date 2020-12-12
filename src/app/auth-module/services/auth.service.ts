import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  doLogin(){
    this.httpClient.get('http://localhost:8081/api/EMTServices/login').subscribe(
      res=>{
      console.log(res)
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
}