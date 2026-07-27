import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject, switchMap, tap } from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';
import { SearchService } from './search-service';

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
    combineLatest([this.pageNumbersub$, this.searchService.searchValue$])
      .pipe(
        switchMap(([pageNumber, searchValue]) => {
          return this.movieService.getMovies(pageNumber, searchValue);
        }),
      )
      .subscribe({
        next: (response: OmdbMovieResponse) => {
          if (response.Response === 'True') {
            console.log(response.Response, typeof response.Response);
            this.totalResults.set(Number(response.totalResults));
            this.movieList.set(response.Search);
            this.getFavoriteMoviesImdbIds();
            this.applyIsFavorit();
          } else {
            console.log(response.Error);
          }
        },
        error: (err) => {
          console.log('errrrrrrrrrr');

          console.log('from here');
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
        this.favImdbIDList.set(new Set(...tempIds));
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
