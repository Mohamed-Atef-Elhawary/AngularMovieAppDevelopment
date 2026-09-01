import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { snakBarConfig } from '../config/snakbar-config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MovieIntegrationService {
  pageNumbersub$ = new BehaviorSubject<number>(1);
  newFavMovieSub$ = new Subject<string>();
  movieList = new BehaviorSubject<OmdbMovieSearch[]>([]);
  totalResults = signal<number>(0);
  favImdbIDList = signal<Set<string>>(new Set());

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
    private snakBar: MatSnackBar,
  ) {}

  toggleFavImdbID = this.newFavMovieSub$.subscribe((imdbID) => {
    if (this.favImdbIDList().has(imdbID)) {
      this.favImdbIDList.update((currentSet) => {
        let newSet = new Set(currentSet);
        newSet.delete(imdbID);
        return newSet;
      });
    } else {
      this.favImdbIDList.update((currentSet) => {
        let newSet = new Set(currentSet);
        newSet.add(imdbID);
        return newSet;
      });
    }
    this.applyIsFavorit();
  });

  getMovies() {
    this.pageNumbersub$
      .pipe(
        switchMap((pageNumber) => {
          return forkJoin([
            this.movieService
              .getMovies(pageNumber)
              .pipe(
                catchError(() =>
                  throwError(() => new Error('server error please try again later')),
                ),
              ),
            this.favoriteService
              .getFavorites()
              .pipe(
                catchError(() =>
                  throwError(() => new Error('server error please try again later')),
                ),
              ),
          ]);
        }),
      )
      .subscribe({
        next: ([res, favorites]: [OmdbMovieResponse, FavoriteMovie[]]) => {
          if (res.Response === 'True' && res.Search.length) {
            const favIds = new Set(favorites.map((f) => f.imdbID));
            this.favImdbIDList.set(favIds);

            const updatedMovies = res.Search.map((movie) => ({
              ...movie,
              isFavorite: favIds.has(movie.imdbID),
            }));
            this.totalResults.set(Number(res.totalResults));
            this.movieList.next(updatedMovies);
          } else {
            this.favImdbIDList.set(new Set());
            this.movieList.next([]);
            this.totalResults.set(0);
          }
        },
        error: () => {
          this.snakBar.open('Please try again later', 'Close', snakBarConfig);
        },
      });
  }

  getFavoriteMoviesImdbIds() {
    this.favoriteService.getFavorites().subscribe({
      next: (response: FavoriteMovie[]) => {
        let tempIds: string[] = [];
        response.forEach((res) => {
          tempIds.push(res.imdbID);
        });
        this.favImdbIDList.set(new Set(tempIds));
        this.applyIsFavorit();
      },
      error: (err) => {},
    });
  }

  applyIsFavorit() {
    const movies = this.movieList.value;
    const updatedMovies = movies.map((movie) => {
      if (this.favImdbIDList().has(movie.imdbID)) {
        return { ...movie, isFavorite: true };
      }
      return { ...movie, isFavorite: false };
    });

    this.movieList.next(updatedMovies);
  }
}
