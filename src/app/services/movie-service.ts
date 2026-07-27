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

  // APIURL: 'https://www.omdbapi.com/?s=Action&apikey=ace370de&page=1',

  getMovies(pageNumber: number, searchValue: string): Observable<OmdbMovieResponse> {
    return this.http.get<OmdbMovieResponse>(
      `${environment.APIURL}/?s=${searchValue}&apiKey=${environment.apikey}&page=${pageNumber}`,
    );
  }
}
