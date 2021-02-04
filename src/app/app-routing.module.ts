import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeolocationErrorViewComponent } from './components/geolocation-error-view/geolocation-error-view.component';
import {MapComponent} from './components/map/map.component'
import {WelcomeComponent} from './components/welcome/welcome.component'
const routes: Routes = [
  {path:'map', component:MapComponent},{path:'welcome', component:WelcomeComponent},{path:'geoError', component:GeolocationErrorViewComponent},
{ path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
    } ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
