//HomeComponent.ts
import { Component, computed, signal } from '@angular/core';
import { OmdbMovieResponse, OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MovieService } from '../../services/movie-service';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-pagenator-init';

@Component({
  selector: 'app-home-component',
  imports: [MovieCardComponent, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private movieService: MovieService) {}
  omdbMovieResponse = signal<OmdbMovieResponse>({} as OmdbMovieResponse);
  movies = computed<OmdbMovieSearch[]>(() => this.omdbMovieResponse().Search);
  totalResults = computed<number>(() => Number(this.omdbMovieResponse().totalResults) || 0);

  pageIndex = signal<string>('1');

  ngOnInit() {
    this.getPageMovies();
  }
  getPageMovies() {
    this.movieService.getPageMovies(this.pageIndex()).subscribe({
      next: (res) => {
        this.omdbMovieResponse.set(res);
        console.log(this.omdbMovieResponse().totalResults);
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }
  onPageChange(event: PageEvent) {
    this.pageIndex.set(String(event.pageIndex + 1));
    this.getPageMovies();
  }
}
