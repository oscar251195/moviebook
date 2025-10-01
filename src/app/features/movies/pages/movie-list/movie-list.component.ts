import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import {Movie} from "../../../../core/models/movie.model";
import {MovieService} from "../../../../core/services/movie.service";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  private movieService = inject(MovieService);

  ngOnInit() {
    this.movieService.getMovies().subscribe(data => this.movies = data);
  }
}
