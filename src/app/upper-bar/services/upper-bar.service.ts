import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpperBarService {

  private openLoginOut = new BehaviorSubject<string>(null);

  uopenLogin$ = this.openLoginOut.asObservable();

  constructor() { }

  openLogin(openLogin: string){
    this.openLoginOut.next(openLogin);
  }
}
