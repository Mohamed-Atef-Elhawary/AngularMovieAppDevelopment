import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { FavoriteMovie, OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { MovieService } from './movie-service';
import { FavoriteService } from './favorite-service';

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

  getMovies() {
    this.pageNumbersub$.subscribe((pageNumber: number) => {
      this.movieService.getMovies(1).subscribe(console.log);
      this.movieService.getMovies(pageNumber).subscribe({
        next: (response: OmdbMovieResponse) => {
          this.totalResults.set(Number(response.totalResults));
          this.movieList.set(response.Search);
          this.getFavoriteMoviesImdbIds();
          this.applyIsFavorit();
        },
        error: (err) => {
          console.log('from here');
        },
      });
    });
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
