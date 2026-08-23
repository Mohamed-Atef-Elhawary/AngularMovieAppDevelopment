import { Component, computed, signal } from '@angular/core';
import { FavoriteService } from '../../services/favorite-service';
import { FavoriteMovie } from '../../interfaces/omdb-movie';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';
import { SlicePipe } from '@angular/common';
import { SearchService } from '../../services/search-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-favorite-component',
  imports: [MovieCardComponent, MatPaginatorModule, SlicePipe],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './favorite-component.html',
  styleUrl: './favorite-component.css',
})
export class FavoriteComponent {
  storedfavoriteMovies = signal<FavoriteMovie[]>([]);
  favoriteMovies = signal<FavoriteMovie[]>([]);
  totalResults = computed<number>(() => this.favoriteMovies().length);
  slicleRange = signal<number>(0);
  constructor(
    private favoriteService: FavoriteService,
    private searchService: SearchService,
  ) {}
  ngOnInit() {
    this.favoriteService.getFavorites().subscribe((favMoveis: FavoriteMovie[]) => {
      this.storedfavoriteMovies.set(favMoveis);
      this.favoriteMovies.set(favMoveis);
    });

    this.searchService.searchValue$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchTitle: string) => {
        if (searchTitle) {
          this.favoriteMovies.update(() => {
            return this.storedfavoriteMovies().filter((movie) => {
              let title = movie.Title.toLowerCase();
              return title.includes(searchTitle.toLowerCase());
            });
          });
        } else {
          this.favoriteMovies.set(this.storedfavoriteMovies());
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.slicleRange.set(event.pageIndex);
  }
}
