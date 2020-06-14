import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeStationInfoComponent } from './bike-station-info.component';

describe('BikeStationInfoComponent', () => {
  let component: BikeStationInfoComponent;
  let fixture: ComponentFixture<BikeStationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeStationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeStationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
