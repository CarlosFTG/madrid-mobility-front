import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material-module';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
//import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoaadingNearStationsComponent } from './components/loaading-near-stations/loaading-near-stations.component';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { NomadriddialogComponent } from './components/nomadriddialog/nomadriddialog.component';
import { ErrordialogComponent } from './components/errordialog/errordialog.component';
import { BikeStationInfoComponent } from './components/bike-station-info/bike-station-info.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TabledetailComponent  } from './components/tabledetail/tabledetail.component';
import { InfoCardModule } from './info-card/info-card.module';
import { LegendModule } from './legend/legend.module';
import { UpperBarModule } from './upper-bar/upper-bar.module';

import { TokenInterceptor } from './auth-module/token.interceptor';
import { InfoPopupComponent } from './components/info-popup/info-popup.component';
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
    TabledetailComponent,
    InfoPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    TableModule,
    //MatProgressSpinnerModule,
    InfoCardModule,
    LegendModule,
    UpperBarModule
  ],
  entryComponents: [
    DialogComponent,LoaadingNearStationsComponent,WelcomeDialogComponent,
    NomadriddialogComponent,ErrordialogComponent,BikeStationInfoComponent,
    TabledetailComponent, InfoPopupComponent
  ],
  providers: [
     MapComponent,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },],
  bootstrap: [AppComponent],
  
})
export class AppModule { }

