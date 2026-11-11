import { Component, DebugElement, input, signal } from '@angular/core';
import { MovieIntegrationService } from '../../services/movie-integration-service';
import { MovieService } from '../../services/movie-service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home-component';
import { OmdbMovieSearch } from '../../interfaces/omdb-movie';
import { BehaviorSubject, first, Subject } from 'rxjs';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../services/my-custom-paginator-init';

@Component({ selector: 'app-movie-card-component', template: '' })
class MockMovieCardComponent {
  movieInput = input.required<OmdbMovieSearch>();
}

type MockMovieIntegrationService = Pick<
  MovieIntegrationService,
  'getMovies' | 'movieList' | 'totalResults' | 'pageNumbersub$'
>;

type MockMovieService = Pick<MovieService, 'searchValue$'>;

function buildMovie(): OmdbMovieSearch {
  return {
    imdbID: 'm4',
    isFavorite: false,
    Poster: 'poster4',
    Title: 'title4',
    Type: 't',
    Year: '4',
  };
}
describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let homeComponent: HomeComponent;
  let mockMovieIntegrationService: MockMovieIntegrationService;
  let mockMovieService: MockMovieService;

  const MOVIE_LIST: OmdbMovieSearch[] = [
    { imdbID: 'm1', isFavorite: false, Poster: 'poster1', Title: 'title1', Type: 't', Year: '1' },
    { imdbID: 'm2', isFavorite: false, Poster: 'poster2', Title: 'title2', Type: 't', Year: '2' },
    { imdbID: 'm3', isFavorite: false, Poster: 'poster3', Title: 'title3', Type: 't', Year: '3' },
  ];

  beforeEach(async () => {
    mockMovieIntegrationService = {
      getMovies: vi.fn(),
      movieList: new BehaviorSubject<OmdbMovieSearch[]>([]),
      totalResults: signal<number>(0),
      pageNumbersub$: new BehaviorSubject<number>(1),
    };

    mockMovieService = {
      searchValue$: new Subject<string>(),
    };
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
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
  });
  it('should create', () => {
    expect(homeComponent).toBeTruthy();
  });

  describe('HomeComponent movies', () => {
    describe('request movies', () => {
      it('should request movies from the service', () => {
        fixture.detectChanges();
        expect(mockMovieIntegrationService.getMovies).toHaveBeenCalledOnce();
      });
    });

    describe('display movies', () => {
      const displayedMovies = () => {
        const movieCardComponents = fixture.debugElement.queryAll(
          By.directive(MockMovieCardComponent),
        );
        return movieCardComponents.map((movie) => movie.componentInstance.movieInput());
      };
      beforeEach(() => {
        fixture.detectChanges();
        mockMovieIntegrationService.movieList.next(MOVIE_LIST);
        fixture.detectChanges();
      });
      it('should render all movie list with correct order', () => {
        expect(displayedMovies()).toEqual(MOVIE_LIST);
      });

      it('should render the latest movie list', () => {
        const newMovieList: OmdbMovieSearch[] = [MOVIE_LIST[0], buildMovie()];

        mockMovieIntegrationService.movieList.next(newMovieList);
        fixture.detectChanges();
        expect(displayedMovies()).toEqual(newMovieList);
      });

      it('should not render movie card when movie list is empty', () => {
        expect(displayedMovies().length).toBe(MOVIE_LIST.length);

        mockMovieIntegrationService.movieList.next([]);
        fixture.detectChanges();
        expect(displayedMovies().length).toBe(0);
      });
    });

    describe('search for movies', () => {
      const movieCardComponents = () => {
        return fixture.debugElement.queryAll(By.directive(MockMovieCardComponent));
      };
      beforeEach(() => {
        vi.useFakeTimers();
        fixture.detectChanges();
        mockMovieIntegrationService.movieList.next(MOVIE_LIST);
        fixture.detectChanges();
      });
      afterEach(() => {
        vi.useRealTimers();
      });

      describe('when there is a search title', () => {
        it('should render the matched movies', () => {
          mockMovieService.searchValue$.next('title1');
          vi.advanceTimersByTime(1000);
          fixture.detectChanges();
          expect(movieCardComponents().length).toBe(1);
          expect(movieCardComponents()[0].componentInstance.movieInput()).toEqual(MOVIE_LIST[0]);
        });
        it('should not render movies when no matching', () => {
          expect(movieCardComponents().length).toBe(MOVIE_LIST.length);

          mockMovieService.searchValue$.next('not found');
          vi.advanceTimersByTime(1000);
          fixture.detectChanges();

          expect(movieCardComponents().length).toBe(0);
        });
      });
      describe('when there is no search title', () => {
        it('should render all movies', () => {
          mockMovieService.searchValue$.next('not found');
          vi.advanceTimersByTime(1000);
          fixture.detectChanges();
          expect(movieCardComponents().length).toBe(0);

          mockMovieService.searchValue$.next('');
          vi.advanceTimersByTime(1000);
          fixture.detectChanges();
          expect(movieCardComponents().length).toBe(MOVIE_LIST.length);
        });
      });

      it('should wait a second before filtering', () => {
        mockMovieService.searchValue$.next('title1');
        fixture.detectChanges();

        expect(movieCardComponents().length).toBe(MOVIE_LIST.length);
        vi.advanceTimersByTime(999);
        fixture.detectChanges();
        expect(movieCardComponents().length).toBe(MOVIE_LIST.length);
        vi.advanceTimersByTime(1);
        fixture.detectChanges();
        expect(movieCardComponents().length).toBe(1);
      });
    });
  });

  describe('paginator', () => {
    let loader: HarnessLoader;
    let paginatorHarness: MatPaginatorHarness;
    beforeEach(async () => {
      loader = TestbedHarnessEnvironment.loader(fixture);
      paginatorHarness = await loader.getHarness(MatPaginatorHarness);
    });
    describe('when page number changes', () => {
      it('should update page number when move back and forth', async () => {
        mockMovieIntegrationService.totalResults.set(100);

        await paginatorHarness.goToNextPage();
        expect(mockMovieIntegrationService.pageNumbersub$.value).toBe(2);
        await paginatorHarness.goToPreviousPage();
        expect(mockMovieIntegrationService.pageNumbersub$.value).toBe(1);
      });
    });
    describe('number of pages', () => {
      it('should display the number of page', async () => {
        mockMovieIntegrationService.totalResults.set(89);
        const label = (await paginatorHarness.getRangeLabel()).split(' ');
        const numberOfPage = label[label.length - 1];

        expect(numberOfPage).toBe('9');
      });
    });
  });
});
