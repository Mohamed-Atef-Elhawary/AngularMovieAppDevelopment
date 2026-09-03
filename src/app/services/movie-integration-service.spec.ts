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
  let favorites: FavoriteMovie[];
  let response: OmdbMovieResponse;
  let search: OmdbMovieSearch[];
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
    // idList = ['1', '2', '3', '4', '5'];
    TestBed.configureTestingModule({
      providers: [
        { provide: MovieService, useValue: mockMovieService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    });
    movieIntegrationService = TestBed.inject(MovieIntegrationService);
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
  it('should create', () => {
    expect(movieIntegrationService).toBeTruthy();
  });
  describe('toggleFavImdbID', () => {
    beforeEach(() => {
      movieIntegrationService.getMovies();
    });
    it('should toggle isFavorite to true if it was false', () => {
      movieIntegrationService.newFavMovieSub$.next('1');
      expect(movieIntegrationService.movieList.value[0].isFavorite).toBe(true);
    });
    it('should toggle isFavorite to false if it was true', () => {
      movieIntegrationService.newFavMovieSub$.next('2');
      expect(movieIntegrationService.movieList.value[1].isFavorite).toBe(false);
    });
  });
  describe('getMovies', () => {
    beforeEach(() => {});

    describe('when ApI call succeeds', () => {
      describe('when the response is "true" and Search array not empty', () => {
        beforeEach(() => {
          movieIntegrationService.getMovies();
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
      describe('when the response is "False" or Search array is empty', () => {
        beforeEach(() => {
          response = { Response: 'true', totalResults: '0', Search: [], Error: '' };
          mockMovieService.getMovies.mockReturnValue(of(response));
          movieIntegrationService.getMovies();
        });
        it('should emit movieList with empty array', () => {
          expect(movieIntegrationService.movieList.value).toEqual([]);
        });
        it('should set totalResults with zero', () => {
          expect(movieIntegrationService.totalResults()).toBe(0);
        });
      });
    });

    describe('when ApI call fails', () => {
      it('should call snakBar.open with specific message, title, config', () => {
        mockMovieService.getMovies.mockReturnValue(throwError(() => new Error('server error')));
        movieIntegrationService.getMovies();
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Please try again later',
          'Close',
          snakBarConfig,
        );
      });
    });
  });

  describe('getFavoriteMoviesImdbIds', () => {
    describe('when API call succeeds', () => {
      it('should emit movieList with based on favorite movies id', () => {
        movieIntegrationService.movieList.next(search);
        movieIntegrationService.getFavoriteMoviesImdbIds();
        const updatedMovies = search.map((movie) => ({
          ...movie,
          isFavorite: ['2', '3'].includes(movie.imdbID),
        }));
        expect(movieIntegrationService.movieList.value).toEqual(updatedMovies);
      });
    });
    describe('when API call fails', () => {
      it('should call snakBar.open with specific message, title, config', () => {
        mockFavoriteService.getFavorites.mockReturnValue(
          throwError(() => new Error('server error')),
        );
        movieIntegrationService.getFavoriteMoviesImdbIds();
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Please try again later',
          'Close',
          snakBarConfig,
        );
      });
    });
  });
});
