import { Component, computed, input } from '@angular/core';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-movie-card-component',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './movie-card-component.html',
  styleUrl: './movie-card-component.css',
})
export class MovieCardComponent {
  avatar = 'avatar.jpg';
  movieInput = input.required<OmdbMovieSearch>();
  movie = computed<OmdbMovieSearch>(() => {
    const poster = this.movieInput().Poster === 'N/A';
    return {
      ...this.movieInput(),
      Poster: poster ? this.avatar : this.movieInput().Poster,
    };
  });

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.avatar) {
      img.src = this.avatar;
    }
  }
}
