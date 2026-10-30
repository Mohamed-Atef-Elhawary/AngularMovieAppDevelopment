import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home-component';
import { MovieIntegrationService } from '../../services/movie-integration-service';
import { MovieService } from '../../services/movie-service';
import { Component, input, signal, WritableSignal } from '@angular/core';
import { Mock } from 'vitest';
import { BehaviorSubject, Subject } from 'rxjs';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';

@Component({ selector: 'app-movie-card-component', template: '' })
class MockMovieCardComponent {
  movieInput = input.required<OmdbMovieSearch>();
}

type MockMovieIntegrationService = Omit<
  Pick<MovieIntegrationService, 'movieList' | 'totalResults' | 'pageNumbersub$' | 'getMovies'>,
  'getMovies'
> & {
  getMovies: Mock;
};

type MockMovieService = Pick<MovieService, 'searchValue$'>;

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let homeComponent: HomeComponent;
  let mockMovieIntegrationService: MockMovieIntegrationService;
  let mockMovieService: MockMovieService;

  beforeEach(async () => {
    mockMovieIntegrationService = {
      getMovies: vi.fn(),
      movieList: new BehaviorSubject<OmdbMovieSearch[]>([]),
      totalResults: signal(0),
      pageNumbersub$: new BehaviorSubject(1),
    };

    mockMovieService = {
      searchValue$: new Subject(),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: MovieIntegrationService, useValue: mockMovieIntegrationService },
        { provide: MovieService, useValue: mockMovieService },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [MovieCardComponent] },
        add: { imports: [MockMovieCardComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    homeComponent = fixture.componentInstance;
    // fixture.detectChanges();
  });
  it('should create', () => {
    expect(homeComponent).toBeTruthy();
  });
});
