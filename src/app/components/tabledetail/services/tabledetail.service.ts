import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabledetailService {

  private selectedStationIdOut = new BehaviorSubject<any>(null);
  selectedStationId$ = this.selectedStationIdOut.asObservable();

  notifySelectedStationId(selectedStationId){
    this.selectedStationIdOut.next(selectedStationId);
  }

  constructor() { }
}
