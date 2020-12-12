import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl(),
      'password': new FormControl(),
    });
  }

  login(){
    let loginParams = {
      'email':this.loginForm.get('email').value,
      'password':this.loginForm.get('password').value
    }

    
    this.authService.doLoginUser(loginParams)
  }
}
