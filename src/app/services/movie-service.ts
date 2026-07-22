//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OmdbMovieResponse } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}
  getPageMovies(pageNumner: string): Observable<OmdbMovieResponse> {
    return this.http.get<OmdbMovieResponse>(`${environment.APIURL}&page=${pageNumner}`);
  }
}
