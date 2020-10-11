import { TestBed } from '@angular/core/testing';

import { InfoCardService } from './info-card.service';

describe('InfoCardService', () => {
  let service: InfoCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
