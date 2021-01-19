import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { UpperBarService } from '../services/upper-bar.service';

@Component({
  selector: 'app-upper-bar',
  templateUrl: './upper-bar.component.html',
  styleUrls: ['./upper-bar.component.css']
})
export class UpperBarComponent implements OnInit {

  userName: string;

  constructor(private upperBarService: UpperBarService, private authService: AuthService) { 
     this.authService.userToken$.subscribe(userToken => {
       if(userToken != null){
         let payload = JSON.parse(atob(userToken.split(".")[1]));
         this.userName = payload.name;
       }
     })

  }

  ngOnInit(): void {
  }

  openLogin() {
    this.upperBarService.openLogin('login');
  }

}
