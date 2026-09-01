import { Mock } from 'vitest';
import { MovieIntegrationService } from './movie-integration-service';
import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';

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
    describe('when ApI call succeeds', () => {
      let response: OmdbMovieResponse;
      let search: OmdbMovieSearch[];
      let favorites: FavoriteMovie[];

      describe('when the response is "true" and Search array not empty', () => {
        beforeEach(() => {
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
          mockMovieService.getMovies.mockReturnValue(of(response));
          mockFavoriteService.getFavorites.mockReturnValue(of(favorites));
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
      // describe('when the response is "false" or Search array is empty', () => {
      //   it('should set favImdbIDList with empty set', () => {});
      //   it('should emit movieList with empty array', () => {});
      //   it('should set totalResults with zero', () => {});
      // });
    });

    // describe('when ApI call fails', () => {
    //   it('should call snakBar.open with specific message, title, config', () => {});
    // });
  });
  // describe("getFavoriteMoviesImdbIds",()=>{})
  // describe("applyIsFavorit",()=>{})
});
