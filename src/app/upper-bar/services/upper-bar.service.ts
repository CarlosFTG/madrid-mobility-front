import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpperBarService {

  private openLoginOut = new BehaviorSubject<boolean>(null);

  uopenLogin$ = this.openLoginOut.asObservable();

  constructor() { }

  openLogin(openLogin: boolean){
    this.openLoginOut.next(openLogin);
  }
}
