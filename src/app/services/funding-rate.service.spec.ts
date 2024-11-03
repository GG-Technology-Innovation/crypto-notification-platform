import { TestBed } from '@angular/core/testing';

import { FundingRateService } from './funding-rate.service';

describe('FundingRateService', () => {
  let service: FundingRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
