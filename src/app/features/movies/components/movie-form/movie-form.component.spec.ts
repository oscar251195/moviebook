import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MovieFormComponent} from './movie-form.component';
import {MovieService} from '../../../../core/services/movie.service';
import {of} from 'rxjs';
import {provideRouter} from '@angular/router';
import {Movie} from "../../../../core/models/movie.model";
import {signal} from "@angular/core";

class MockMovieService {
  movies = signal<Movie[]>([]);
  getMovieById = jasmine.createSpy('getMovieById').and.returnValue(of({id: 1, title: 'A Bronx Tale'}));
  addMovie = jasmine.createSpy('addMovie').and.returnValue(of({}));
  updateMovie = jasmine.createSpy('updateMovie').and.returnValue(of({}));
}

describe('MovieFormComponent', () => {
  let component: MovieFormComponent;
  let fixture: ComponentFixture<MovieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFormComponent],
      providers: [{provide: MovieService, useClass: MockMovieService}, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form initially', () => {
    expect(component.formGroup.value.title).toBe('');
  });

  it('should call addMovie on submit when not editing', () => {
    const service = TestBed.inject(MovieService);

    // Aseguramos que el componente esté en modo "crear"
    component.editing.set(false);

    component.formGroup.patchValue({
      title: 'Test',
      genre: 'Drama',
      description: 'Desc',
      year: 2020,
      rating: 8,
      image_url: ''
    });

    component.onSubmit();

    expect(service.addMovie).toHaveBeenCalled();
  });
});
