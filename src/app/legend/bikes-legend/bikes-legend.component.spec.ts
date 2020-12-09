import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikesLegendComponent } from './bikes-legend.component';

describe('BikesLegendComponent', () => {
  let component: BikesLegendComponent;
  let fixture: ComponentFixture<BikesLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikesLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikesLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
