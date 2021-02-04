import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { GlobalService } from 'src/app/services/global.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-activate-location-modal',
  templateUrl: './activate-location-modal.component.html',
  styleUrls: ['./activate-location-modal.component.css']
})
export class ActivateLocationModalComponent implements OnInit {

  languageEN: boolean;

  constructor(public dialogRef: MatDialogRef<ActivateLocationModalComponent>,private router: Router, private bikesLayerService: BikesLayerService) { }

  ngOnInit(): void {
    this.getLanguage();
  }

  closeDialog(){
    this.bikesLayerService.notifyBikes(false);
    this.dialogRef.close();
    this.router.navigate(['geoError']);
  }

  getLanguage(){
    if(localStorage.getItem('language')==='ES'){
      this.languageEN = false;
    }else{
      this.languageEN = true;
    }
  }

}
