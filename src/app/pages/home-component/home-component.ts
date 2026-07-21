import { Component, signal } from '@angular/core';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-home-component',
  imports: [],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private movieService: MovieService) {}
  movies = signal<OmdbMovieSearch[]>([]);
  ngOnInit() {
    // this.movieService.getAllMovies().subscribe((response: OmdbMovieResponse) => {
    //   this.movies.set(response.Search);
    //   console.log(this.movies());
    // });

    this.movieService.getMultiplePages().subscribe({
      next: (res) => console.log('res', res),
      error: (err) => console.log('err', err),
    });
  }
}
