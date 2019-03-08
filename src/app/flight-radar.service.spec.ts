import { TestBed } from '@angular/core/testing';

import { FlightRadarService } from './flight-radar.service';

describe('FlightRadarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightRadarService = TestBed.get(FlightRadarService);
    expect(service).toBeTruthy();
  });
});
