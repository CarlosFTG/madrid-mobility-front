import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendColapseComponent } from './legend-colapse.component';

describe('LegendColapseComponent', () => {
  let component: LegendColapseComponent;
  let fixture: ComponentFixture<LegendColapseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendColapseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendColapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
