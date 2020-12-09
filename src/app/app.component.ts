import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from './auth-module/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'madrid-mobility-front';

  constructor(private authService: AuthService){

  }

  ngOnInit(): void {
    this.authService.doLogin();
  }
}
