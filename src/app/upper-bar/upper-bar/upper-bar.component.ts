import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { InfoCardService } from 'src/app/info-card/services/info-card.service';
import { UpperBarService } from '../services/upper-bar.service';

@Component({
  selector: 'app-upper-bar',
  templateUrl: './upper-bar.component.html',
  styleUrls: ['./upper-bar.component.css']
})
export class UpperBarComponent implements OnInit {

  userName: string;
  userLocationAddress = localStorage.getItem('userLocationAddress');

  constructor(private upperBarService: UpperBarService, 
    private authService: AuthService,
    private infoCardService: InfoCardService) { 
     this.authService.userToken$.subscribe(userToken => {
       if(userToken != null){
         let payload = JSON.parse(atob(userToken.split(".")[1]));
         this.userName = payload.name;
       }
     })

     this.infoCardService.newUserPosition$.subscribe(newUserPosition => {
      if(newUserPosition != null){
        this.userLocationAddress = newUserPosition;
      }
    })

  }

  ngOnInit(): void {
  }

  openLogin() {
    this.upperBarService.openLogin('login');
  }

  logOut(){
    this.userName = undefined;
    localStorage.removeItem('JWT_TOKEN');
    this.authService.logOut();
  }

}
