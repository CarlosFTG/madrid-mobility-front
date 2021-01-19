import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material-module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    CommonModule, MaterialModule,ReactiveFormsModule
  ],
  exports:[
    LoginComponent,RegisterComponent
  ]
})
export class AuthModuleModule { }
