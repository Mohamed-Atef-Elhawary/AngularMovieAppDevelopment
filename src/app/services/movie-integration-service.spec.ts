import { TestBed } from '@angular/core/testing';

import { MovieIntegrationService } from './movie-integration-service';

describe('MovieFacadeService', () => {
  let service: MovieIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
