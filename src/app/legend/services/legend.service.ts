import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegendService {

  private toggleChangeOut = new BehaviorSubject<any>(null);

  toggleChange$ = this.toggleChangeOut.asObservable();

  constructor() { }

  toggleChange(){
    this.notifyToggleChange(0);
  }

  notifyToggleChange(zero:number){
    this.toggleChangeOut.next(zero);
  }
}
