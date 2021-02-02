import { Component, Input, OnInit } from '@angular/core';
import { InfoCardService } from '../services/info-card.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../../services/map.service';

declare let L;

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements OnInit {

  streets: any = new Array;
  myForm: FormGroup;
  errorNumberResults = false;
  zoomButtontext: String = 'Zoom to my position';
  userPosition;
  @Input() languageEN: boolean;

  constructor(private infoCardService: InfoCardService,
    private mapService: MapService) {
  }

  ngOnInit(): void {

    this.createAddressForm();

    this.mapService.sendUserPositionToInfoCard$.subscribe(userPosition => {
      this.userPosition = userPosition;
    });

    // this.mapService.sendDevice$.subscribe(mobile => {
    //   console.log(mobile)
    //   this.mobile = mobile;
    // });
  }

  createAddressForm() {
    this.myForm = new FormGroup({
      firstName: new FormControl()
    });
  }


  zoomTo() {


    if (this.zoomButtontext === 'Zoom to my position') {
      this.zoomButtontext = 'Zoom global'
      //@ts-ignore
      let userPosition ={
        'position':this.userPosition,
        'option': 'userPosition'
      }
      this.infoCardService.zoomTo(userPosition);
    } else {
      this.zoomButtontext = 'Zoom to my position'
      let globalPosition ={
        'position': [40.4167754,-3.7037902],
        'option':'global'
      }
      this.infoCardService.zoomTo(globalPosition);
      //mapLeaflet.setView([40.4167754, -3.7037902], 13);
    }
  }

  _filterAdress(value: string): any[] {
    const filterValue = value;
    let resultF: any[];
    if (filterValue.length > 8) {
      if (this.streets) {
        resultF = this.streets.filter(street => {
          if (street.wholeAddress != null) {
            return street.wholeAddress.toLowerCase().includes(filterValue);
          } else {
            return false;
          }
        })
      } else {
        return null;
      }
    }
    return resultF;
  }

  onChangeStreet(event: any) {
    let address = event.option.value;
    var matches = address.match(/(\d+)/);
    let streetWithOutNumber = address.substring(0, matches.index).trim() + '+';
    let addressSplitted = address.split(" ");
    streetWithOutNumber += addressSplitted[0]
    let cleanStreet = streetWithOutNumber.substring(streetWithOutNumber.indexOf(' '), streetWithOutNumber.length)
    address = matches[0] + ',' + cleanStreet + ',madrid,spain';

    //replace *****with you api key
    this.infoCardService.getAdressCoordinates(address).subscribe(
      res => {

         var myIcon = L.icon({
           iconSize: [41, 51],
           iconAnchor: [20, 51],
           popupAnchor: [-3, -76],
           shadowSize: [68, 95],

           shadowAnchor: [22, 94]
         });
         myIcon.options.iconUrl = 'assets/leaflet/point.png';
         //@ts-ignore
         this.infoCardService.sendFoundAdressIconToMap(L.marker([res.results[0].locations[0].latLng.lat, res.results[0].locations[0].latLng.lng], {
          icon: myIcon, clickable:
            true, draggable: 'false'
        }));
      }, err => {
        console.log(err)
      }
    )
  }

}
