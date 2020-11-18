import { TestBed } from '@angular/core/testing';

import { BikesLayerService } from './bikes-layer.service';

describe('BikesLayerService', () => {
  let service: BikesLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikesLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
