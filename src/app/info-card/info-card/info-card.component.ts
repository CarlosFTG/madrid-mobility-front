import { Component, OnInit } from '@angular/core';
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
  filteredStreets: Observable<String[]>
  myForm: FormGroup;
  positionCompositionForm: FormGroup;
  errorNumberResults = false;
  nearestBikeStations: any = new Array;
  addressFinderControl = new FormControl();
  zoomButtontext: String = 'Zoom to my position';
  userPosition;
  mobile: boolean;

  constructor(private infoCardService: InfoCardService,
    private mapService: MapService) {
    this.filteredStreets = this.addressFinderControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterAdress(value))

      );
  }

  ngOnInit(): void {

    this.getStreets();
    this.createAddressForm();
    this.createForm();

    this.mapService.sendUserPositionToInfoCard$.subscribe(userPosition => {
      this.userPosition = userPosition;
    });

    this.mapService.sendDevice$.subscribe(mobile => {
      console.log(mobile)
      this.mobile = mobile;
    });
  }

  createAddressForm() {
    this.myForm = new FormGroup({
      firstName: new FormControl()
    });
  }

  createForm() {
    this.positionCompositionForm = new FormGroup({
      'numberOfResults': new FormControl(),
    });
  }

  async getStreets() {
    this.infoCardService.getStreets().subscribe(
      data => {
        this.streets = data;
      }
    );

  }

  getClosestStation() {
    var re = new RegExp("^[1-9]\d*$");
    if (this.positionCompositionForm.get('numberOfResults').value != null && re.test(this.positionCompositionForm.get('numberOfResults').value)) {
      this.errorNumberResults = false;

      let params = {
        'numberOfResults': parseFloat(this.positionCompositionForm.get('numberOfResults').value),
        //@ts-ignore
        'coordinates': 'POINT (' + this.userPosition.lat + ' ' + this.userPosition.lng + '),3857)'
      }
      //const data = await this._http.post('http://localhost:8081/api/EMTServices/findClosestStations', params).toPromise();
      this.nearestBikeStations = this.infoCardService.getClosestsStations(params).subscribe(
        data => {
          this.nearestBikeStations = data;
          //@ts-ignore
          if (this.nearestBikeStations.length > 0) {
            this.infoCardService.sendClosestsStationsToMap(this.nearestBikeStations);
             this.positionCompositionForm.get('numberOfResults').reset();
          } else {

          }
        }
      );


    } else {
      this.errorNumberResults = true;
      this.positionCompositionForm.get('numberOfResults').reset();
    }

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
