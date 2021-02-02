import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend-colapse',
  templateUrl: './legend-colapse.component.html',
  styleUrls: ['./legend-colapse.component.css']
})
export class LegendColapseComponent implements OnInit {

  showLegend:boolean=true

  constructor() { }

  ngOnInit(): void {
  }

  showCollapseLegend(){
    if(this.showLegend){
      this.showLegend=false;
    }else{
      this.showLegend=true;
    }
  }

}
