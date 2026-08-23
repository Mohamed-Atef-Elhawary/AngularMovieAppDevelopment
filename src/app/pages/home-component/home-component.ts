//HomeComponent.ts
import { Component, computed, signal } from '@angular/core';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MovieService } from '../../services/movie-service';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';
import { MovieIntegrationService } from '../../services/movie-integration-service';
import { SearchService } from '../../services/search-service';
import { debounce, debounceTime, distinct, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home-component',
  imports: [MovieCardComponent, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  storedMovieList = signal<OmdbMovieSearch[]>([]);
  movieList = signal<OmdbMovieSearch[]>([]);
  constructor(
    private movieIntegrationService: MovieIntegrationService,
    private searchService: SearchService,
  ) {}
  ngOnInit() {
    this.movieIntegrationService.movieList.subscribe((movies) => {
      this.storedMovieList.set(movies);
      this.movieList.set(movies);
    });
    this.searchService.searchValue$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchTitle: string) => {
        if (searchTitle) {
          this.movieList.update(() => {
            return this.storedMovieList().filter((movie) => {
              let title = movie.Title.toLowerCase();
              return title.includes(searchTitle.toLowerCase());
            });
          });
        } else {
          this.movieList.set(this.storedMovieList());
        }
      });
  }

  totalResults = computed<number>(() => this.movieIntegrationService.totalResults());

  onPageChange(event: PageEvent) {
    this.movieIntegrationService.pageNumbersub$.next(event.pageIndex + 1);
  }
}
