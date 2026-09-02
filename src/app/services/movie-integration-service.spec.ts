import { Mock } from 'vitest';
import { MovieIntegrationService } from './movie-integration-service';
import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { HttpErrorResponse } from '@angular/common/http';
import { snakBarConfig } from '../config/snakbar-config';

interface MovieServiceInterface {
  getMovies: Mock<(pageNumber: number) => Observable<OmdbMovieResponse>>;
}
interface FavoriteServiceInterface {
  getFavorites: Mock<FavoriteService['getFavorites']>;
}
interface SnakBarInterface {
  open: Mock;
}

describe('MovieIntegrationService', () => {
  let movieIntegrationService: MovieIntegrationService;
  let mockMovieService: MovieServiceInterface;
  let mockFavoriteService: FavoriteServiceInterface;
  let mockMatSnackBar: SnakBarInterface;
  let idList: string[];
  beforeEach(() => {
    mockMovieService = {
      getMovies: vi.fn(),
    };
    mockFavoriteService = {
      getFavorites: vi.fn(),
    };
    mockMatSnackBar = {
      open: vi.fn(),
    };
    idList = ['1', '2', '3', '4', '5'];
    TestBed.configureTestingModule({
      providers: [
        { provide: MovieService, useValue: mockMovieService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    });
    movieIntegrationService = TestBed.inject(MovieIntegrationService);
  });
  it('should create', () => {
    expect(movieIntegrationService).toBeTruthy();
  });
  describe('toggleFavImdbID', () => {
    it('should delete  movies imdbID from favImdbIDList if exists', () => {
      movieIntegrationService.favImdbIDList.set(new Set(idList));
      movieIntegrationService.newFavMovieSub$.next('1');
      expect(movieIntegrationService.favImdbIDList()).toEqual(new Set(['2', '3', '4', '5']));
    });
    it('should add  movies imdbID to favImdbIDList if not exists', () => {
      movieIntegrationService.favImdbIDList.set(new Set(idList));
      movieIntegrationService.newFavMovieSub$.next('6');
      expect(movieIntegrationService.favImdbIDList()).toEqual(
        new Set(['1', '2', '3', '4', '5', '6']),
      );
    });
  });
  describe('getMovies', () => {
    let favorites: FavoriteMovie[];
    let response: OmdbMovieResponse;
    let search: OmdbMovieSearch[];
    beforeEach(() => {
      favorites = [
        {
          Poster: 'poster 2',
          Title: 'title 2',
          Type: 'type 2',
          Year: '2002',
          imdbID: '2',
          isFavorite: false,
          docId: 'doc 2',
        },
        {
          Poster: 'poster 3',
          Title: 'title 3',
          Type: 'type 3',
          Year: '2003',
          imdbID: '3',
          isFavorite: false,
          docId: 'doc 3',
        },
      ];
      search = [
        {
          Poster: 'poster 1',
          Title: 'title 1',
          Type: 'type 1',
          Year: '2001',
          imdbID: '1',
          isFavorite: false,
        },
        {
          Poster: 'poster 2',
          Title: 'title 2',
          Type: 'type 2',
          Year: '2002',
          imdbID: '2',
          isFavorite: false,
        },
        {
          Poster: 'poster 3',
          Title: 'title 3',
          Type: 'type 3',
          Year: '2003',
          imdbID: '3',
          isFavorite: false,
        },

        {
          Poster: 'poster 4',
          Title: 'title 4',
          Type: 'type 4',
          Year: '2004',
          imdbID: '4',
          isFavorite: false,
        },
      ];
      response = { Response: 'True', totalResults: '4', Search: search, Error: '' };

      mockMovieService.getMovies.mockReturnValue(of(response));
      mockFavoriteService.getFavorites.mockReturnValue(of(favorites));
    });

    describe('when ApI call succeeds', () => {
      describe('when the response is "true" and Search array not empty', () => {
        beforeEach(() => {
          movieIntegrationService.getMovies();
        });
        it('should set favImdbIDList with the favorite movies id', () => {
          expect(movieIntegrationService.favImdbIDList()).toEqual(new Set(['2', '3']));
        });
        it('should set totalResults with the res.totalResults', () => {
          expect(movieIntegrationService.totalResults()).toBe(4);
        });
        it('should emit movieList with movies including isFavorite state', () => {
          const listValue: OmdbMovieSearch[] = search.map((movie) => ({
            ...movie,
            isFavorite: ['2', '3'].includes(movie.imdbID),
          }));
          expect(movieIntegrationService.movieList.value).toEqual(listValue);
        });
      });
      describe('when the response is "False"', () => {
        it('should set favImdbIDList with empty set', () => {
          response = { Response: 'False', totalResults: '0', Search: search, Error: '' };
          mockMovieService.getMovies.mockReturnValue(of(response));
          movieIntegrationService.getMovies();
          expect(movieIntegrationService.favImdbIDList()).toEqual(new Set());
        });
      });
      describe('when Search array is empty', () => {
        it('should emit movieList with empty array', () => {
          response = { Response: 'true', totalResults: '0', Search: [], Error: '' };
          mockMovieService.getMovies.mockReturnValue(of(response));
          movieIntegrationService.getMovies();
          expect(movieIntegrationService.movieList.value).toEqual([]);
        });
      });
      describe('when the response is "False" and Search array is empty', () => {
        it('should set totalResults with zero', () => {
          response = { Response: 'false', totalResults: '0', Search: [], Error: '' };
          mockMovieService.getMovies.mockReturnValue(of(response));
          movieIntegrationService.getMovies();
          expect(movieIntegrationService.totalResults()).toBe(0);
        });
      });
    });

    describe('when ApI call fails', () => {
      beforeEach(() => {
        mockMovieService.getMovies.mockReturnValue(throwError(() => new Error('server error')));
        movieIntegrationService.getMovies();
      });
      it('should call snakBar.open with specific message, title, config', () => {
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Please try again later',
          'Close',
          snakBarConfig,
        );
      });
      it('should call snakBar.open once', () => {
        expect(mockMatSnackBar.open).toHaveBeenCalledOnce();
      });
    });
  });
  // describe("getFavoriteMoviesImdbIds",()=>{})
  // describe("applyIsFavorit",()=>{})
});
