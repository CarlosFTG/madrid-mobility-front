import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressFinderComponent } from './adress-finder.component';

describe('AdressFinderComponent', () => {
  let component: AdressFinderComponent;
  let fixture: ComponentFixture<AdressFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdressFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdressFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
