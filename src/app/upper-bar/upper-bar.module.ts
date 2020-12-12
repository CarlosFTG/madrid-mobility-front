import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperBarComponent } from './upper-bar/upper-bar.component';
import { MaterialModule } from '../material-module';
import { AuthModuleModule } from '../auth-module/auth-module.module';



@NgModule({
  declarations: [UpperBarComponent],
  imports: [
    CommonModule,MaterialModule, AuthModuleModule
  ],
  exports:[
    UpperBarComponent
  ]
})
export class UpperBarModule { }
