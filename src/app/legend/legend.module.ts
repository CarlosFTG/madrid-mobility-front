import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend/legend.component';
import {MaterialModule} from '../material-module'


@NgModule({
  declarations: [LegendComponent],
  imports: [
    CommonModule, MaterialModule
  ],
  exports:[
    LegendComponent
  ]
})
export class LegendModule { }
