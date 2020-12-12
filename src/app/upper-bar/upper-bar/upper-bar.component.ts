import { Component, OnInit } from '@angular/core';
import { UpperBarService } from '../services/upper-bar.service';

@Component({
  selector: 'app-upper-bar',
  templateUrl: './upper-bar.component.html',
  styleUrls: ['./upper-bar.component.css']
})
export class UpperBarComponent implements OnInit {

  constructor(private upperBarService: UpperBarService) { }

  ngOnInit(): void {
  }

  openLogin() {
    this.upperBarService.openLogin(true);
  }

}
