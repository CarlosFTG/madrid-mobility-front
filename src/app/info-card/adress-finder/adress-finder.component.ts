import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StreetsService } from 'src/app/services/streets.service';
import { InfoCardService } from '../services/info-card.service';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import WKT from 'ol/format/WKT';
import { StyleService } from 'src/app/services/style.service';
import { MapService } from 'src/app/services/map.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { StylePointsFeaturesService } from 'src/app/services/style-points-features.service';

@Component({
  selector: 'app-adress-finder',
  templateUrl: './adress-finder.component.html',
  styleUrls: ['./adress-finder.component.css']
})
export class AdressFinderComponent implements OnInit {

  addressFinderForm: FormGroup;
  addressFinderControl = new FormControl();
  filteredStreets: Observable<String[]>
  streetsList: any[] = new Array;
  format = new WKT();
  foundAddressCollection = new Collection;

  constructor(private streetsService: StreetsService,
    private infoCardService: InfoCardService,
    private stylePointsFeaturesService: StylePointsFeaturesService,
    private mapService: MapService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
      
    this.filteredStreets = this.addressFinderControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterAdress(value))

      );

      iconRegistry.addSvgIcon(
        'thumbs-up',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/iconmonstr-plus-3.svg'));
  }

  ngOnInit(): void {

    this.createAddressFinderForm();

    this.streetsService.streetsList$.subscribe(data => {
      if (data != null) {
        this.streetsList = data;
      }
    })
  }

  createAddressFinderForm() {
    this.addressFinderForm = new FormGroup({
      addressToFind: new FormControl()
    });
  }

  _filterAdress(value: string): any[] {
    const filterValue = value;
    let resultF: any[];
    if (filterValue.length > 8) {
      if (this.streetsList) {
        resultF = this.streetsList.filter(street => {
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
      data => {
        //@ts-ignore
        let foundAddressCoords = data.results[0].locations[0].latLng;

        let formatCoords = 'POINT(' + foundAddressCoords.lng + ' ' + foundAddressCoords.lat + " 216.7" + ')';

        let formatCoordsSplitted = formatCoords.split(' ');

        let setViewPoint = formatCoordsSplitted[0] + ' ' + formatCoordsSplitted[1]+ ')';

        let foundAddressCoordsFormatted = this.format.readFeature(formatCoords.replace(
          /[\W]*\S+[\W]*$/, '') + ')', { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).getGeometry().getCoordinates();

        let foundAddressFeature = new Feature({
          geometry: new Point(foundAddressCoordsFormatted)
        });

        this.stylePointsFeaturesService.applyStyleToFoundAdressMarker(foundAddressFeature);
        this.foundAddressCollection.push(foundAddressFeature);

        let foundAddressLayer = new VectorLayer({
          name: 'foundAddress',
          source: new VectorSource({
            features: this.foundAddressCollection
          })
        })

        this.mapService.map$.addLayer(foundAddressLayer);
        
        this.mapService.updateMapViewCenter(setViewPoint);
      }
    );
  }

}
