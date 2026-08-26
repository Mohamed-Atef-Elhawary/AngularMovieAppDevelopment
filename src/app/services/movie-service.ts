//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';
import { catchError, EMPTY, expand, Observable, of, Subject, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  searchValue$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  getMovies(pageNumber: number): Observable<OmdbMovieResponse> {
    let counter = 0;
    const buildUrl = (page: number) =>
      `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=${page}`;

    return this.http.get<OmdbMovieResponse>(buildUrl(pageNumber)).pipe(
      expand((omdResponse: OmdbMovieResponse) => {
        if (omdResponse.Search.length || counter >= 2) {
          return EMPTY;
        }
        counter++;
        return this.http.get<OmdbMovieResponse>(buildUrl(pageNumber + counter));
      }),
      catchError(() => throwError(() => new Error('server error'))),
    );
  }
}
