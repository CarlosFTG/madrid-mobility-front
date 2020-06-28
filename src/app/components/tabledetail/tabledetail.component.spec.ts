import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabledetailComponent } from './tabledetail.component';

describe('TabledetailComponent', () => {
  let component: TabledetailComponent;
  let fixture: ComponentFixture<TabledetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabledetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabledetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
