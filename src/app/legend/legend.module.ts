import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend/legend.component';
import {MaterialModule} from '../material-module';
import { BikesLegendComponent } from './bikes-legend/bikes-legend.component';
import { BusesLegendComponent } from './buses-legend/buses-legend.component'
import { AuthModuleModule } from '../auth-module/auth-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LegendColapseComponent } from './legend-colapse/legend-colapse.component';

@NgModule({
  declarations: [LegendComponent, BikesLegendComponent, BusesLegendComponent, LegendColapseComponent],
  imports: [
    CommonModule, MaterialModule, AuthModuleModule,NgbModule
  ],
  exports:[
    LegendComponent,LegendColapseComponent
  ]
})
export class LegendModule { }
