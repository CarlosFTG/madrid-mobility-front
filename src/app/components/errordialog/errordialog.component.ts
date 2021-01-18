import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../nomadriddialog/nomadriddialog.component';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.css']
})
export class ErrordialogComponent implements OnInit {

  error: string

  constructor(public dialogRef: MatDialogRef<ErrordialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.setError();
  }

  setError(){
    console.log(this.data)
    //@ts-ignore
    let mapquesturlSplitted = this.data.err.url.split('/')[2];
    console.log(mapquesturlSplitted)
    
    //@ts-ignore
    if(mapquesturlSplitted === 'www.mapquestapi.com'){
      this.error = 'An error has occurred retrieving your location, please, try again in a few seconds'
    }
    
  }

}
