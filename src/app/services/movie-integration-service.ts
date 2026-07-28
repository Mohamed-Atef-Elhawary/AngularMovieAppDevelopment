import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject, switchMap, tap } from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { SearchService } from './search-service';
import { snakBarConfig } from '../config/snakbar-config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MovieIntegrationService {
  pageNumbersub$ = new BehaviorSubject<number>(1);
  newFavMovieSub$ = new Subject<string>();
  totalResults = signal<number>(0);
  movieList = signal<OmdbMovieSearch[]>([]);
  favImdbIDList = signal<Set<string>>(new Set());

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
    private searchService: SearchService,
    private snakBar: MatSnackBar,
  ) {
    this.getMovies();
  }

  toggleFavImdbID = this.newFavMovieSub$.subscribe((imdbID) => {
    if (this.favImdbIDList().has(imdbID)) {
      this.favImdbIDList.update((currentSet) => {
        let newSet = currentSet;
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

  // getMovies() {
  //   this.pageNumbersub$
  //     .pipe(
  //       switchMap((pageNumber: number) => {
  //         return this.movieService.getMovies(pageNumber, 'Hero');
  //       }),
  //     )
  //     .subscribe({
  //       next: (response: OmdbMovieResponse) => {
  //         this.totalResults.set(Number(response.totalResults));
  //         this.movieList.set(response.Search);
  //         this.getFavoriteMoviesImdbIds();
  //         this.applyIsFavorit();
  //       },
  //       error: (err) => {
  //         console.log('from here');
  //       },
  //     });
  // }
  getMovies() {
    combineLatest([this.searchService.searchValue$, this.pageNumbersub$])
      .pipe(
        switchMap(([searchValue, pageNumber]) => {
          return this.movieService.getMovies(searchValue, pageNumber);
        }),
      )
      .subscribe({
        next: (response: OmdbMovieResponse) => {
          console.log('response', response);
          if (response.Response === 'True') {
            console.log(response.Response, typeof response.Response);
            this.totalResults.set(Number(response.totalResults));
            this.movieList.set(response.Search);
            this.getFavoriteMoviesImdbIds();
          } else {
            console.log('from intergration servicexxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            this.snakBar.open('Please try again later', 'Close', snakBarConfig);
          }
        },
        error: (err) => {
          console.log('from intergration serviceerrrrrrrrrrrrrrrrrrxxxxxxxxx');
          this.snakBar.open('Please try again later', 'Close', snakBarConfig);
        },
      });

    //   this.pageNumbersub$
    //     .pipe(
    //       switchMap((pageNumber: number) => {
    //         return this.movieService.getMovies(pageNumber, 'Hero');
    //       }),
    //     )
    //     .subscribe({
    //       next: (response: OmdbMovieResponse) => {
    //         this.totalResults.set(Number(response.totalResults));
    //         this.movieList.set(response.Search);
    //         this.getFavoriteMoviesImdbIds();
    //         this.applyIsFavorit();
    //       },
    //       error: (err) => {
    //         console.log('from here');
    //       },
    //     });
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
    });
  }

  applyIsFavorit() {
    this.movieList.update((movies: OmdbMovieSearch[]) => {
      return movies.map((movie) => {
        if (this.favImdbIDList().has(movie.imdbID)) {
          return { ...movie, isFavorite: true };
        }
        return { ...movie, isFavorite: false };
      });
    });
  }
}
