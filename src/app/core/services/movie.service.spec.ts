import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Movie} from "../models/movie.model";

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load movies on init', () => {
    const mockMovies: Movie[] = [
      { id: '1', title: 'Test Movie', genre: 'Drama', description: '', year: 2020, rating: 9, image_url: '' }
    ];

    service.loadMovies().subscribe();

    const req = httpMock.expectOne('http://localhost:3001/movies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);

    expect(service.movies().length).toBe(1);
    expect(service.movies()[0].title).toBe('Test Movie');
  });

  it('should add a movie', () => {
    const newMovie: Movie = { id: '2', title: 'New Movie', genre: 'Action', description: '', year: 2021, rating: 8, image_url: '' };

    service.addMovie(newMovie).subscribe();
    const req = httpMock.expectOne('http://localhost:3001/movies');
    expect(req.request.method).toBe('POST');
    req.flush(newMovie);

    expect(service.movies()).toContain(newMovie);
  });

  it('should delete a movie', () => {
    // Inicializamos el signal con una película
    service.movies.set([{ id: '1', title: 'Test', genre: 'Drama', description: '', year: 2020, rating: 8, image_url: '' }]);

    service.deleteMovie('1').subscribe();
    const req = httpMock.expectOne('http://localhost:3001/movies/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.movies().length).toBe(0);
  });
});
