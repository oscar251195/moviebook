import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovieDetailComponent} from './movie-detail.component';
import {MovieService} from "../../../../core/services/movie.service";
import {Movie} from "../../../../core/models/movie.model";
import {of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  //Espías para ambos servicios
  let mockService: jasmine.SpyObj<MovieService>;
  let mockRouter: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    // Definimos los espías
    mockService = jasmine.createSpyObj('MovieService', ['getMovieById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    //Respuesta simulada
    mockService.getMovieById.and.returnValue(of({
      id: '1', title: 'Test Movie', genre: 'Drama', description: 'Desc',
      year: 2020, rating: 8, image_url: 'test.jpg'
    } as Movie));

    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        {provide: MovieService, useValue: mockService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: {get: () => '1'}}}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie on init', () => {
    expect(mockService.getMovieById).toHaveBeenCalledWith("1");
    expect(component.movie?.title).toBe('Test Movie');
  });

  it('should navigate to /movies when back button is clicked', () => {
    // Buscamos el botón en el DOM.
    const backButton = fixture.debugElement.query(By.css('#back-button'));
    // Simulamos un clic del usuario en el botón.
    backButton.triggerEventHandler('click', null);
    // Verificamos que, como resultado del clic, se llamó a la función de navegación del router
    // con la ruta esperada.
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movies']);
  });
});
