import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend/legend.component';
import {MaterialModule} from '../material-module';
import { BikesLegendComponent } from './bikes-legend/bikes-legend.component';
import { BusesLegendComponent } from './buses-legend/buses-legend.component'
import { AuthModuleModule } from '../auth-module/auth-module.module';


@NgModule({
  declarations: [LegendComponent, BikesLegendComponent, BusesLegendComponent],
  imports: [
    CommonModule, MaterialModule, AuthModuleModule
  ],
  exports:[
    LegendComponent
  ]
})
export class LegendModule { }
