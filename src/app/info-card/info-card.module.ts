import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from './info-card/info-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';
import { ClosestationsComponent } from './closestations/closestations.component';
import { AdressFinderComponent } from './adress-finder/adress-finder.component';
import { InfoCardCollapseComponent } from './info-card-collapse/info-card-collapse.component';


@NgModule({
  declarations: [InfoCardComponent, ClosestationsComponent, AdressFinderComponent, InfoCardCollapseComponent],
  imports: [
    CommonModule,ReactiveFormsModule, MaterialModule
  ],
  exports:[InfoCardComponent,InfoCardCollapseComponent]
})
export class InfoCardModule { }
