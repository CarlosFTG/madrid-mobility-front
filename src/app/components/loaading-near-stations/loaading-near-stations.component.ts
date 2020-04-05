import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-loaading-near-stations',
  templateUrl: './loaading-near-stations.component.html',
  styleUrls: ['./loaading-near-stations.component.css']
})
export class LoaadingNearStationsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoaadingNearStationsComponent>,
    ) { }

  ngOnInit(): void {
  }

}
