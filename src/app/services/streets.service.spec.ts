import { TestBed } from '@angular/core/testing';

import { StreetsService } from './streets.service';

describe('StreetsService', () => {
  let service: StreetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
