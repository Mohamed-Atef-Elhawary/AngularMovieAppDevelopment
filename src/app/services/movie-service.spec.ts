import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie-service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getting movies', () => {
    it('should call the API with the correct URL and page number', () => {});
    describe('when API call successes', () => {
      describe('when response.Search has data', () => {
        it('should return the response to the subscriber', () => {});
        it('should not trigger a second HTTP call', () => {});
      });

      describe('when response.Search is empty', () => {
        it('should retry with an incremented page number', () => {});
        it('should stop retrying once response.Search has data', () => {});
        it('should stop retrying after exceeding the allowed retry count', () => {});
      });
    });
    describe('when any API call fails', () => {
      it('should propagate an error with message "server error" when the initial call fails', () => {});
      it('should propagate an error with message "server error" when a retry call fails', () => {});
    });
  });
});
