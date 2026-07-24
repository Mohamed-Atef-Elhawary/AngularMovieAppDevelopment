//HomeComponent.ts
import { Component, computed } from '@angular/core';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MovieService } from '../../services/movie-service';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';

@Component({
  selector: 'app-home-component',
  imports: [MovieCardComponent, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private movieService: MovieService) {}

  movieList = computed<OmdbMovieSearch[]>(() => {
    console.log(this.movieService.movieList());
    return this.movieService.movieList();
  });
  totalResults = computed<number>(() => this.movieService.totalResults());

  onPageChange(event: PageEvent) {
    this.movieService.pageNumber.next(event.pageIndex + 1);
  }

  // movies = signal<OmdbMovieSearch[]>([]);
  // totalResults = signal<number>(0);
  // pageIndex = signal<string>('1');

  // ngOnInit() {
  // this.getPageMovies();
  // }
  // getPageMovies() {
  //   this.movieService.getPageMovies(this.pageIndex()).subscribe({
  //     next: (res) => {
  //       this.movies.set(res.Search);
  //       this.totalResults.set(Number(res.totalResults));
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     },
  //   });
  // }
  // onPageChange(event: PageEvent) {
  //   this.pageIndex.set(String(event.pageIndex + 1));
  //   this.movieService.pageNumber.next(event.pageIndex + 1);
  //   this.getPageMovies();
  // }
}
