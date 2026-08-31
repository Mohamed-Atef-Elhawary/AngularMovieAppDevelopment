import { Mock } from 'vitest';
import { MovieIntegrationService } from './movie-integration-service';
import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface MovieServiceInterface {
  getMovies: Mock;
}
interface FavoriteServiceInterface {
  getFavorites: Mock;
}
interface SnakBarInterface {
  open: Mock;
}

describe('MovieIntegrationService', () => {
  let movieIntegrationService: MovieIntegrationService;
  let movieService: MovieServiceInterface;
  let favoriteService: FavoriteServiceInterface;
  let matSnackBar: SnakBarInterface;
  let idList: string[];
  beforeEach(() => {
    const mockMovieService: MovieServiceInterface = {
      getMovies: vi.fn(),
    };
    const mockFavoriteService: FavoriteServiceInterface = {
      getFavorites: vi.fn(),
    };
    const mockMatSnackBar: SnakBarInterface = {
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
  // describe("getMovies",()=>{
  //   it("",()=>{})

  // })
  // describe("getFavoriteMoviesImdbIds",()=>{})
  // describe("applyIsFavorit",()=>{})
});
