import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from 'src/app/services/map.service';

import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { StyleService } from 'src/app/services/style.service';
import Collection from 'ol/Collection';
import { StylePointsFeaturesService } from 'src/app/services/style-points-features.service';

export interface DialogData {
  fakeAddress: string;
}

@Component({
  selector: 'app-nomadriddialog',
  templateUrl: './nomadriddialog.component.html',
  styleUrls: ['./nomadriddialog.component.css']
})
export class NomadriddialogComponent implements OnInit {
  value: any;
  format = new WKT();
  apiError:boolean=false;
  languageEN: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<NomadriddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private mapService: MapService, private stylePointsFeaturesService: StylePointsFeaturesService) { }

  ngOnInit(): void {
    this.getLanguage();
  }

  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
    }else{
      this.languageEN = true;
    }
  }

  setFakeUserPosition(fakeAddress) {

    this.mapService.sendUserPositionToInfoCard(fakeAddress);

    let fakeAddressSplt =fakeAddress.split(' ');
    let lng =fakeAddressSplt[0];
    let lat =fakeAddressSplt[1];

    sessionStorage.setItem('userLat', String(lat));
    sessionStorage.setItem('userLng', String(lng));

    let userCoords = {
      //@ts-ignore
      lat:lat,
      //@ts-ignore
      lng:lng
    }

    localStorage.removeItem('userCoords')
    localStorage.setItem('userCoords',JSON.stringify(userCoords));

    let fakeAddressCoords = 'POINT(' + fakeAddress + ')';

    let userPositionCoords = this.format.readFeature(fakeAddressCoords, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates()

    let userPositionFeature = new Feature({
      geometry: new Point(userPositionCoords)
    });

    this.stylePointsFeaturesService.applyStyleToUser(userPositionFeature);

    let userPositionCollection = new Collection;

    userPositionCollection.push(userPositionFeature);

    let userPositionLayer = new VectorLayer({
      name: 'userPosition',
      source: new VectorSource({
        features: userPositionCollection
      })
    });

    this.mapService.map$.addLayer(userPositionLayer);
    this.mapService.updateMapViewCenter(fakeAddressCoords);
    this.dialogRef.close(fakeAddress);
  }

}
