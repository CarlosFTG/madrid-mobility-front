import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationErrorViewComponent } from './geolocation-error-view.component';

describe('GeolocationErrorViewComponent', () => {
  let component: GeolocationErrorViewComponent;
  let fixture: ComponentFixture<GeolocationErrorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocationErrorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocationErrorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
