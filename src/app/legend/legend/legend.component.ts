import { Component, OnInit } from '@angular/core';
import { BikesLayerService } from 'src/app/services/bikes-layer.service';
import { StyleService } from 'src/app/services/style.service';
import { UpperBarService } from 'src/app/upper-bar/services/upper-bar.service';
@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  showInLegend: string = 'legend';

  constructor(private upperBarService: UpperBarService) { 
    this.upperBarService.uopenLogin$.subscribe(
      data=>{
        this.showInLegend= data;
      }
    )
  }

  ngOnInit(): void {
    this.showInLegend = 'legend';
  }
}
