import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie-service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { firstValueFrom } from 'rxjs';

describe('MovieService', () => {
  let httpTestingController: HttpTestingController;
  let service: MovieService;
  let url = `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=1`;
  let omdResponse: OmdbMovieResponse;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MovieService);
    omdResponse = {
      Response: 'res',
      totalResults: '2',
      Search: [{ Poster: '', Title: '', Type: '', Year: '', imdbID: '', isFavorite: false }],
      Error: 'error',
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getting movies', () => {
    it('should call the API with the correct URL for the initial page', () => {
      service.getMovies(1).subscribe();
      const req = httpTestingController.expectOne(url);
      req.flush(omdResponse);
    });
    describe('when API call successes', () => {
      describe('when response.Search has data', () => {
        it('should return the response to the subscriber', () => {
          let response: OmdbMovieResponse = {} as OmdbMovieResponse;
          service.getMovies(1).subscribe((res: OmdbMovieResponse) => (response = res));
          const req = httpTestingController.expectOne(url);
          req.flush(omdResponse);
          expect(response).toEqual(omdResponse);
        });

        it('should not trigger a second HTTP call', () => {
          service.getMovies(1).subscribe();
          const req = httpTestingController.match(url);
          expect(req.length).toBe(1);
          req[0].flush(omdResponse);
        });
      });

      describe('when response.Search is empty', () => {
        let secondUrl: string;
        let thirdUrl: string;
        let fourthUrl: string;
        beforeEach(() => {
          secondUrl = `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=2`;
          thirdUrl = `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=3`;
          fourthUrl = `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=4`;
        });
        it('should retry with an incremented page number', () => {
          service.getMovies(1).subscribe();

          const req1 = httpTestingController.expectOne(url);
          req1.flush({ ...omdResponse, Search: [] });

          const req2 = httpTestingController.expectOne(secondUrl);
          req2.flush(omdResponse);
        });

        it('should stop retrying once response.Search has data', () => {
          service.getMovies(1).subscribe();
          const req1 = httpTestingController.expectOne(url);
          req1.flush({ ...omdResponse, Search: [] });

          const req2 = httpTestingController.expectOne(secondUrl);
          req2.flush(omdResponse);

          httpTestingController.expectNone(thirdUrl);
        });
        it('should stop retrying after exceeding the allowed retry count', () => {
          let complate: boolean = false;
          service.getMovies(1).subscribe({
            next: () => {},
            complete: () => {
              complate = true;
            },
          });
          const req1 = httpTestingController.expectOne(url);
          req1.flush({ ...omdResponse, Search: [] });
          const req2 = httpTestingController.expectOne(secondUrl);
          req2.flush({ ...omdResponse, Search: [] });
          const req3 = httpTestingController.expectOne(thirdUrl);
          req3.flush({ ...omdResponse, Search: [] });
          httpTestingController.expectNone(fourthUrl);
          expect(complate).toBe(true);
        });
      });
    });
    describe('when any API call fails', () => {
      let secondUrl: string;
      beforeEach(() => {
        secondUrl = `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=2`;
      });
      let errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'connection server error',
      });
      it('should propagate an error with message "server error" when the initial call fails', () => {
        let errorMessage: string = '';
        service.getMovies(1).subscribe({
          error: (err) => {
            errorMessage = err.message;
          },
        });
        const req = httpTestingController.expectOne(url);
        req.flush(null, errorResponse);
        expect(errorMessage).toBe('server error');
      });
      it('should propagate an error with message "server error" when a retry call fails', () => {
        let errorMessage: string = '';
        service.getMovies(1).subscribe({
          error: (err) => (errorMessage = err.message),
        });
        const req1 = httpTestingController.expectOne(url);
        req1.flush({ ...omdResponse, Search: [] });
        const req2 = httpTestingController.expectOne(secondUrl);
        req2.flush(null, errorResponse);
        expect(errorMessage).toBe('server error');
      });
    });
  });
});
