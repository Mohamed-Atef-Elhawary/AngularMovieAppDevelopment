//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(pageNumber: number): Observable<OmdbMovieResponse> {
    return this.http.get<OmdbMovieResponse>(`${environment.APIURL}&page=${pageNumber}`);
  }
}
