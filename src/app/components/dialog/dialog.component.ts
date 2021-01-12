import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
     private bikesService: BikesLayerService
    ) {
      dialogRef.disableClose = true;
      this.bikesService.bikes$.subscribe(bikes=>{
        if(bikes != null){
          this.closeDialog();
        }
      })
     }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

}
