import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TabledetailComponent } from 'src/app/components/tabledetail/tabledetail.component';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { MapService } from 'src/app/services/map.service';
import { UserService } from 'src/app/services/user.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoCardService } from '../services/info-card.service';

@Component({
  selector: 'app-closestations',
  templateUrl: './closestations.component.html',
  styleUrls: ['./closestations.component.css']
})
export class ClosestationsComponent implements OnInit {

  positionCompositionForm: FormGroup;
  errorNumberResults = false;
  nearestBikeStations: any = new Array;
  userPosition = {'lat':null, 'lng':null};

  constructor(private bikesLayerService: BikesLayerService, 
    private infoCardService:InfoCardService, 
    private mapService: MapService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.mapService.sendUserPositionToInfoCard$.subscribe(data =>{
      if(data != null){
        //@ts-ignore
        this.userPosition.lat = data.lat;
        //@ts-ignore
        this.userPosition.lng = data.lng;
      }
    })
  }

  createForm() {
    this.positionCompositionForm = new FormGroup({
      'numberOfResults': new FormControl(),
    });
  }

  getClosestStation(){
    var re = new RegExp("^[1-9]\d*$");
    if (this.positionCompositionForm.get('numberOfResults').value != null && re.test(this.positionCompositionForm.get('numberOfResults').value)) {
      this.errorNumberResults = false;

      let params = {
        'numberOfResults': parseFloat(this.positionCompositionForm.get('numberOfResults').value),
        //@ts-ignore
        'coordinates': 'POINT (' + this.userPosition.lng + ' ' + this.userPosition.lat + '),3857)'
      }
      //const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations', params).toPromise();
      this.bikesLayerService.getClosestsStations(params).subscribe(
        data => {
          this.nearestBikeStations = data;
          this.openTableDetail();
          //@ts-ignore
          if (this.nearestBikeStations.length > 0) {
            //this.infoCardService.sendClosestsStationsToMap(this.nearestBikeStations);
             this.positionCompositionForm.get('numberOfResults').reset();
          } else {

          }
        }
      );


    } else {
    }
  }

   openTableDetail() {
     this.infoCardService.notifyClosestStations(this.nearestBikeStations);
     const dialogRef = this.dialog.open(TabledetailComponent, {
       width: '600px',
     });
     dialogRef.afterClosed().subscribe(result => {
        });
   }

}
