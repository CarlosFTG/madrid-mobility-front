import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusesLegendComponent } from './buses-legend.component';

describe('BusesLegendComponent', () => {
  let component: BusesLegendComponent;
  let fixture: ComponentFixture<BusesLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusesLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusesLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
