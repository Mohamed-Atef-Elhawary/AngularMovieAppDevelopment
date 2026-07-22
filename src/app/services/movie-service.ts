//MovieService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, retry, throwError } from 'rxjs';
import { OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  // getAllMovies(): Observable<OmdbMovieSearch[]> {
  //   const page1 = this.http.get<OmdbMovieResponse>(
  //     'https://www.omdbapi.com/?s=Inception&apikey=ace370de&page=1',
  //   );
  //   const page2 = this.http.get<OmdbMovieResponse>(
  //     'https://www.omdbapi.com/?s=Inception&apikey=ace370de&page=2',
  //   );
  //   return forkJoin([page1, page2]).pipe(
  //     map(([res1, res2]) => {
  //       return [...(res1.Search || []), ...(res2.Search || [])];
  //     }),
  //     retry({ count: 1, delay: 1000 }),
  //     catchError((err, caught) => throwError(() => new Error('Please try again later'))),
  //   );
  // }
  getPageMovies(pageNumner: string): Observable<OmdbMovieResponse> {
    return this.http.get<OmdbMovieResponse>(`${environment.APIURL}&page=${pageNumner}`);
  }
}
