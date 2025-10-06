import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { MovieListComponent } from './movie-list.component';
import { MovieService } from '../../../../core/services/movie.service';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../../../../core/models/movie.model';
import { provideRouter } from '@angular/router';
import {of} from "rxjs";

// Mock del servicio con signal simulado
class MockMovieService {
  movies = signal<Movie[]>([
    { id: 1, title: 'Avatar', genre: 'Sci-Fi', description: '', year: 2009, rating: 9, image_url: '' },
    { id: 2, title: 'Titanic', genre: 'Romance', description: '', year: 1997, rating: 8, image_url: '' },
    { id: 3, title: 'Alien', genre: 'Sci-Fi', description: '', year: 1979, rating: 9, image_url: '' }
  ]);

  loadMovies() {
    return of([]); // Devuelve un Observable que se completa inmediatamente.
  }
}

describe('MovieListComponent (Signals)', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieListComponent, ReactiveFormsModule],
      providers: [
        { provide: MovieService, useClass: MockMovieService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should show all movies initially', () => {
    expect(component.filteredMovies().length).toBe(3);
  });

  it('should filter movies by search term', fakeAsync(() => {
    component.filterForm.get('search')!.setValue('titanic');
    tick(200);

    expect(component.filteredMovies().length).toBe(1);
    expect(component.filteredMovies()[0].title).toBe('Titanic');
  }));

  it('should filter movies by genre', async () => {
    component.filterForm.get('genre')!.setValue('Sci-Fi');
    await fixture.whenStable();

    expect(component.filteredMovies().length).toBe(2);
    expect(component.filteredMovies()[0].genre).toBe('Sci-Fi');
  });

  it('should compute unique genres correctly', () => {
    const genres = component.uniqueGenres;
    expect(genres).toContain('Sci-Fi');
    expect(genres).toContain('Romance');
    expect(genres.length).toBe(2);
  });
});
