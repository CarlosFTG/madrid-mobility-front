import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaadingNearStationsComponent } from './loaading-near-stations.component';

describe('LoaadingNearStationsComponent', () => {
  let component: LoaadingNearStationsComponent;
  let fixture: ComponentFixture<LoaadingNearStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaadingNearStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaadingNearStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
