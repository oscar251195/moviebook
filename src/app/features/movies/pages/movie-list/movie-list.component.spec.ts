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
});
