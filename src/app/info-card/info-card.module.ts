import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from './info-card/info-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';


@NgModule({
  declarations: [InfoCardComponent],
  imports: [
    CommonModule,ReactiveFormsModule, MaterialModule
  ],
  exports:[InfoCardComponent]
})
export class InfoCardModule { }
