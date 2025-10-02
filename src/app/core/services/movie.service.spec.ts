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

  it('should fetch movies', () => {
    const mockMovies: Movie[] = [
      { id: 1, title: 'Test', genre: 'Drama', description: 'Test Movie description', year: 2000, rating: 9, image_url: 'img.jpg' }
    ];

    service.getMovies().subscribe((movies) => {
      expect(movies.length).toBe(1);
      expect(movies[0].title).toBe('Test');
    });

    const req = httpMock.expectOne('http://localhost:3000/movies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });
});
