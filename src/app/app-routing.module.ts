import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from './components/map/map.component'
import {WelcomeComponent} from './components/welcome/welcome.component'
const routes: Routes = [
  {path:'map', component:MapComponent},{path:'welcome', component:WelcomeComponent},
{ path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
    } ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
