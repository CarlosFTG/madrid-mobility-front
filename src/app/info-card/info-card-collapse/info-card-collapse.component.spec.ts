import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardCollapseComponent } from './info-card-collapse.component';

describe('InfoCardCollapseComponent', () => {
  let component: InfoCardCollapseComponent;
  let fixture: ComponentFixture<InfoCardCollapseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCardCollapseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCardCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
