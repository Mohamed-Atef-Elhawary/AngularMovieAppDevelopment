//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(searchValue: string, pageNumber: number): Observable<OmdbMovieResponse> {
    console.log('from movie service searchValue, pageNumber', searchValue, pageNumber);
    return this.http.get<OmdbMovieResponse>(
      `${environment.APIURL}/?s=${searchValue}&apiKey=${environment.apikey}&page=${pageNumber}`,
    );
  }
}
