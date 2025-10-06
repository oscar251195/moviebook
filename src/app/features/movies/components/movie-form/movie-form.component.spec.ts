import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieFormComponent } from './movie-form.component';
import { MovieService } from '../../../../core/services/movie.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

class MockMovieService {
  getMovieById = jasmine.createSpy().and.returnValue(of({ id: 1, title: 'Avatar' }));
  addMovie = jasmine.createSpy().and.returnValue(of({}));
  updateMovie = jasmine.createSpy().and.returnValue(of({}));
}

describe('MovieFormComponent', () => {
  let component: MovieFormComponent;
  let fixture: ComponentFixture<MovieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFormComponent],
      providers: [{ provide: MovieService, useClass: MockMovieService }, provideRouter([])],
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
    component.formGroup.patchValue({ title: 'Test', genre: 'Drama', year: 2020, rating: 8 });
    component.onSubmit();
    expect(service.addMovie).toHaveBeenCalled();
  });
});
