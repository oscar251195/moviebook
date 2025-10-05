import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListComponent } from './movie-list.component';
import {Movie} from "../../../../core/models/movie.model";
import {of} from "rxjs";
import {MovieService} from "../../../../core/services/movie.service";
import {provideRouter} from "@angular/router";

// Creamos un mock simple del servicio
class MockMovieService {
  getMovies() {
    return of([{ id: 1, title: 'Test Movie', genre: 'Drama', description: 'Test Movie description', year: 2020, rating: 9, image_url: '' } as Movie]);
  }
}
describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        { provide: MovieService, useClass: MockMovieService },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies from service on init', () => {
    expect(component.movies.length).toBeGreaterThan(0);
    expect(component.movies[0].title).toBe('Test Movie');
  });

  it('should initialize filter form with empty values', () => {
    expect(component.filterForm.get('search')?.value).toBe('');
    expect(component.filterForm.get('genre')?.value).toBe('');
  });

  it('should filter movies by title', () => {
    component.movies = [
      { id: 1, title: 'Test Movie', genre: 'Drama', description: '', year: 2020, rating: 8, image_url: '' },
      { id: 2, title: 'Other Film', genre: 'Comedy', description: '', year: 2021, rating: 7, image_url: '' },
    ];
    component.applyFilters('test', '');
    expect(component.filteredMovies.length).toBe(1);
    expect(component.filteredMovies[0].title).toBe('Test Movie');
  });

  it('should filter movies by genre', () => {
    component.movies = [
      { id: 1, title: 'Test Movie', genre: 'Drama', description: '', year: 2020, rating: 8, image_url: '' },
      { id: 2, title: 'Other Film', genre: 'Comedy', description: '', year: 2021, rating: 7, image_url: '' },
    ];
    component.applyFilters('', 'Comedy');
    expect(component.filteredMovies.length).toBe(1);
    expect(component.filteredMovies[0].genre).toBe('Comedy');
  });
});
