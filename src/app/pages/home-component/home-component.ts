//HomeComponent.ts
import { Component, computed, signal } from '@angular/core';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MovieService } from '../../services/movie-service';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';
import { MovieIntegrationService } from '../../services/movie-integration-service';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-home-component',
  imports: [MovieCardComponent, MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private movieIntegrationService: MovieIntegrationService) {}

  movieList = computed<OmdbMovieSearch[]>(() => {
    return this.movieIntegrationService.movieList();
  });

  totalResults = computed<number>(() => this.movieIntegrationService.totalResults());

  onPageChange(event: PageEvent) {
    this.movieIntegrationService.pageNumbersub$.next(event.pageIndex + 1);
  }
}
