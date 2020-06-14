import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomadriddialogComponent } from './nomadriddialog.component';

describe('NomadriddialogComponent', () => {
  let component: NomadriddialogComponent;
  let fixture: ComponentFixture<NomadriddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomadriddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomadriddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
