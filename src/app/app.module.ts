import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoaadingNearStationsComponent } from './components/loaading-near-stations/loaading-near-stations.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DialogComponent,
    LoaadingNearStationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    TableModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    DialogComponent,LoaadingNearStationsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

