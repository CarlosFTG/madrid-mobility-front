import { Injectable } from '@angular/core';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  private userPositionOut = new BehaviorSubject<any[]>(null);
  sendUserPositionToInfoCard$ = this.userPositionOut.asObservable();

  constructor() { }

  sendUserPositionToInfoCard(userPosition: any) {
    this.userPositionOut.next(userPosition);
  }
}
