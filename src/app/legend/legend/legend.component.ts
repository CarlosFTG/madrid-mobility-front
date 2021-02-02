import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { ParkingService } from 'src/app/services/parking.service';
import { StyleService } from 'src/app/services/style.service';
import { UpperBarService } from 'src/app/upper-bar/services/upper-bar.service';
@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  showInLegend: string = 'legend';

  constructor(private upperBarService: UpperBarService, private authService: AuthService, private parkingService: ParkingService) { 
    this.upperBarService.uopenLogin$.subscribe(
      data=>{
        if(data != null){
          this.showInLegend= data;
        }else{
          this.showInLegend= 'legend';
        }
        
      }
    )
    this.authService.userToken$.subscribe(userToken => {
      if(userToken != null){
        this.showInLegend = 'legend';
      }
    })
  }

  ngOnInit(): void {
    this.showInLegend = 'legend';
  }

  getFreePlaces(){

    let userLocation = localStorage.getItem('userLocationCoords').split(' ');

    console.log(userLocation)

    let params = {
      'userToken':localStorage.getItem('JWT_TOKEN'),
      'lat':userLocation[0],
      'lng':userLocation[1]
    }
    this.parkingService.getFreeParkingPlaces(params).subscribe();
  }
}
