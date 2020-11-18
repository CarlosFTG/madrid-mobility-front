import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosestationsComponent } from './closestations.component';

describe('ClosestationsComponent', () => {
  let component: ClosestationsComponent;
  let fixture: ComponentFixture<ClosestationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosestationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
