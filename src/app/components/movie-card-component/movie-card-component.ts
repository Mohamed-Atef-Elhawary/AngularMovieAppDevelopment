import { Component, computed, input, signal } from '@angular/core';
import { OmdbMovieSearch, FavoriteMovie } from '../../interfaces/omdb-movie';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MovieService } from '../../services/movie-service';
import { FavoriteService } from '../../services/favorite-service';
import { MovieIntegrationService } from '../../services/movie-integration-service';
import { ActivatedRoute, Route } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-movie-card-component',
  imports: [MatCardModule, MatButtonModule, NgClass],
  templateUrl: './movie-card-component.html',
  styleUrl: './movie-card-component.css',
})
export class MovieCardComponent {
  avatar = 'avatar.jpg';
  movieInput = input.required<OmdbMovieSearch | FavoriteMovie>();
  movie = signal<OmdbMovieSearch | FavoriteMovie>({} as OmdbMovieSearch);
  parentPath = signal<string>('');
  isDisabled = computed<boolean>(
    () =>
      (this.movie().isFavorite && this.parentPath() === 'home') ||
      (!this.movie().isFavorite && this.parentPath() === 'favorite'),
  );

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
    private movieIntegrationService: MovieIntegrationService,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges() {
    this.movie.update(() => {
      const poster = this.movieInput().Poster === 'N/A';
      return {
        ...this.movieInput(),
        Poster: poster ? this.avatar : this.movieInput().Poster,
      };
    });
  }
  ngOnInit() {
    this.parentPath.set(this.route.snapshot.url[0].path);
  }
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.avatar) {
      img.src = this.avatar;
    }
  }

  toggleFavorite() {
    this.movie.update((data) => ({ ...data, isFavorite: !data.isFavorite }));
    if (this.movie().isFavorite) {
      this.favoriteService.addFavorite(this.movie()).subscribe();
      this.movieIntegrationService.newFavMovieSub$.next(this.movie().imdbID);
    } else {
      const movie = this.movie();
      if ('docId' in movie) {
        this.movieIntegrationService.newFavMovieSub$.next(this.movie().imdbID);
        this.favoriteService.removeFavorite(movie.docId).subscribe();
      }
    }
  }
}
