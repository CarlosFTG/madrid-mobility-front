import { TestBed } from '@angular/core/testing';

import { BikeAccidentService } from './bike-accident.service';

describe('BikeAccidentService', () => {
  let service: BikeAccidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikeAccidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
