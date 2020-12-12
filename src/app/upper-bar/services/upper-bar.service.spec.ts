import { TestBed } from '@angular/core/testing';

import { UpperBarService } from './upper-bar.service';

describe('UpperBarService', () => {
  let service: UpperBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpperBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
