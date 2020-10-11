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
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { NomadriddialogComponent } from './components/nomadriddialog/nomadriddialog.component';
import { ErrordialogComponent } from './components/errordialog/errordialog.component';
import { BikeStationInfoComponent } from './components/bike-station-info/bike-station-info.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TabledetailComponent } from './components/tabledetail/tabledetail.component';
import { InfoCardModule } from './info-card/info-card.module';
import { LegendModule } from './legend/legend.module';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DialogComponent,
    LoaadingNearStationsComponent,
    WelcomeDialogComponent,
    NomadriddialogComponent,
    ErrordialogComponent,
    BikeStationInfoComponent,
    WelcomeComponent,
    TabledetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    TableModule,
    MatProgressSpinnerModule,
    InfoCardModule,
    LegendModule
  ],
  entryComponents: [
    DialogComponent,LoaadingNearStationsComponent,WelcomeDialogComponent,
    NomadriddialogComponent,ErrordialogComponent,BikeStationInfoComponent,
    TabledetailComponent
  ],
  providers: [
     MapComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

