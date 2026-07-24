//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  http = inject(HttpClient);
  pageNumber = new BehaviorSubject<number>(1);
  favSub$ = new Subject<string>();

  movieList = signal<OmdbMovieSearch[]>([]);
  totalResults = signal<number>(0);

  favImdbIDList = signal<Set<string>>(this.getFavImdbIDList());

  getFavImdbIDList(): Set<string> {
    const favListString: string | null = localStorage.getItem('favImdbIDList');
    if (favListString) {
      return new Set(JSON.parse(favListString));
    }
    return new Set(null);
  }

  toggleFavImdbID = this.favSub$.subscribe((imdbID) => {
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
    localStorage.setItem('favImdbIDList', JSON.stringify([...this.favImdbIDList()]));
  });

  getMovies = this.pageNumber.subscribe((pageNumber) => {
    this.http
      .get<OmdbMovieResponse>(`${environment.APIURL}&page=${pageNumber}`)
      .subscribe((response) => {
        this.movieList.update(() => {
          let movies = response.Search;
          movies.forEach((searchMovie) => {
            if (this.favImdbIDList().has(searchMovie.imdbID)) {
              searchMovie.isFavorite = true;
            }
          });
          return movies;
        });
        this.totalResults.set(Number(response.totalResults));
      });
  });

  // getPageMovies(pageNumner: string): Observable<OmdbMovieResponse> {
  //   return this.http.get<OmdbMovieResponse>(`${environment.APIURL}&page=${pageNumner}`);
  // }
}
