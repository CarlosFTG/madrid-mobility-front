import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateLocationModalComponent } from './activate-location-modal.component';

describe('ActivateLocationModalComponent', () => {
  let component: ActivateLocationModalComponent;
  let fixture: ComponentFixture<ActivateLocationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateLocationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
