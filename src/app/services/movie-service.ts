//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';
import { Observable, of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  searchValue$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  getMovies(pageNumber: number): Observable<OmdbMovieResponse> {
    return this.http
      .get<OmdbMovieResponse>(
        `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=${pageNumber}`,
      )
      .pipe(
        switchMap((omdResponse: OmdbMovieResponse) => {
          console.log('hhhhhhhhhhhhhhhhhhhh');
          if (!omdResponse.Search.length) {
            return this.http.get<OmdbMovieResponse>(
              `${environment.APIURL}/?s=${environment.s}&apiKey=${environment.apikey}&page=${pageNumber}`,
            );
          } else {
            return of(omdResponse);
          }
        }),
      );
  }
}
