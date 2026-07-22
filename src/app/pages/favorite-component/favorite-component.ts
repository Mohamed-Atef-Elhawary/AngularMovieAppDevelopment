import { Component, computed, signal } from '@angular/core';
import { FavoriteService } from '../../services/favorite-service';
import { FavoriteMovie } from '../../interfaces/omdb-movie';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-favorite-component',
  imports: [MovieCardComponent, MatPaginatorModule, SlicePipe],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],

  templateUrl: './favorite-component.html',
  styleUrl: './favorite-component.css',
})
export class FavoriteComponent {
  favoriteMovies = signal<FavoriteMovie[]>([]);
  totalResults = computed<number>(() => this.favoriteMovies().length);
  slicleRange = signal<number>(0);
  constructor(private favoriteService: FavoriteService) {}
  ngOnInit() {
    this.favoriteService.getFavorites().subscribe((favMoveis: FavoriteMovie[]) => {
      this.favoriteMovies.set(favMoveis);
    });
  }

  onPageChange(event: PageEvent) {
    this.slicleRange.set(event.pageIndex);
  }
}
