import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, retry, throwError } from 'rxjs';
import { OmdbMovieResponse, OmdbMovieSearch } from '../interfaces/omdb-movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}
  getAllMovies(): Observable<OmdbMovieResponse> {
    return this.http.get<OmdbMovieResponse>('https://www.omdbapi.com/?s=Inception&apikey=ace370de');
  }

  getMultiplePages(): Observable<OmdbMovieSearch[]> {
    const page1 = this.http.get<OmdbMovieResponse>(
      'https://www.omdbapi.com/?s=Inception&apikey=ace370de&page=1',
    );
    const page2 = this.http.get<OmdbMovieResponse>(
      'https://www.omdbapi.com/?s=Inception&apikey=ace370de&page=2',
    );
    return forkJoin([page1, page2]).pipe(
      map(([res1, res2]) => {
        console.log('form map res1', res1);
        console.log('form map res1.search', res1.Search);
        return [...(res1.Search || []), ...(res2.Search || [])];
      }),
      retry({ count: 1, delay: 1000 }),
      catchError((err, caught) => throwError(() => new Error('Please try again later'))),
    );
  }
}
