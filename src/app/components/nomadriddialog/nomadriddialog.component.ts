import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  fakeAddress: string;
}

@Component({
  selector: 'app-nomadriddialog',
  templateUrl: './nomadriddialog.component.html',
  styleUrls: ['./nomadriddialog.component.css']
})
export class NomadriddialogComponent implements OnInit {
  value:any;
  constructor(
    public dialogRef: MatDialogRef<NomadriddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  setFakeUserPosition(fakeAddress){
    /* let data: DialogData;
   data.fakeAddress=fakeAddress; */
   this.dialogRef.close(fakeAddress);
  }

}
