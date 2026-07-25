import { Component, computed, input, signal } from '@angular/core';
import { OmdbMovieSearch, FavoriteMovie } from '../../interfaces/omdb-movie';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MovieService } from '../../services/movie-service';
import { FavoriteService } from '../../services/favorite-service';
import { MovieIntegrationService } from '../../services/movie-integration-service';

@Component({
  selector: 'app-movie-card-component',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './movie-card-component.html',
  styleUrl: './movie-card-component.css',
})
export class MovieCardComponent {
  avatar = 'avatar.jpg';
  movieInput = input.required<OmdbMovieSearch | FavoriteMovie>();

  // isFavorite = computed<'Favorite' | 'UnFavorite'>(() => {
  //   const imdbIDIsExists: boolean = this.movieService.favImdbIDList().has(this.movieInput().imdbID);
  //   // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  //   return imdbIDIsExists ? 'UnFavorite' : 'Favorite';
  // });

  movie = signal<OmdbMovieSearch | FavoriteMovie>({} as OmdbMovieSearch);

  allowed = computed<boolean>(() => {
    const movie = this.movie();
    return 'docId' in movie;
  });

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
    private movieIntegrationService: MovieIntegrationService,
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
      if (this.allowed()) {
        const movie = this.movie();
        if ('docId' in movie) {
          this.movieIntegrationService.newFavMovieSub$.next(this.movie().imdbID);
          this.favoriteService.removeFavorite(movie.docId).subscribe();
        }
      }
    }
  }
}
