import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UpperBarService } from 'src/app/upper-bar/services/upper-bar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginOrRegister: boolean = true;

  constructor(private authService: AuthService, private upperBarService: UpperBarService) { }

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
      'password':this.loginForm.get('password').value,
      'getHash':true
    }

    
    this.authService.doLoginUser(loginParams)
  }

  getBack(){
    this.authService.notifyUserToken('back');
  }

  showRegister(){
    this.loginOrRegister = false;
  }
}
