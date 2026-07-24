import { Component, computed, input, signal } from '@angular/core';
import { OmdbMovieSearch, FavoriteMovie } from '../../interfaces/omdb-movie';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MovieService } from '../../services/movie-service';
import { FavoriteService } from '../../services/favorite-service';

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

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
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
    console.log(this.movie());
    if (this.movie().isFavorite) {
      this.favoriteService.addFavorite(this.movie()).subscribe();
    } else {
      let movie = this.movie();
      if ('docId' in movie) {
        this.favoriteService.removeFavorite(movie.docId).subscribe();
      }
    }
    this.movieService.favSub$.next(this.movie().imdbID);
  }
}
