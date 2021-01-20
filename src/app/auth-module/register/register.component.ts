import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = new FormGroup({
      'name': new FormControl(),
      'surname': new FormControl(),
      'email': new FormControl(),
      'password': new FormControl(),
      'password2': new FormControl(),
    });
  }

  register(){
    if(this.passwordMatch()){

      let registerParams = {
        'name': this.registerForm.get('name').value,
        'surname': this.registerForm.get('surname').value,
        'email': this.registerForm.get('email').value,
        'password': this.registerForm.get('password').value,
        'app': 'madrid-mobility'
      }
      this.authService.registerUser(registerParams);
    }else{

    }
  }

  passwordMatch(){
    if(this.registerForm.get('password').value === this.registerForm.get('password2').value){
      return true;
    }else{
      return false;
    }
  }
}
