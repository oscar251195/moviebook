import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import {Movie} from "../../../../core/models/movie.model";
import {MovieService} from "../../../../core/services/movie.service";

/**
 * Componente principal para la página que muestra la lista de películas.
 * Se encarga de obtener los datos y renderizar una `MovieCardComponent` por cada película.
 */

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

  // Lista de películas que se mostrarán en la vista
  movies: Movie[] = [];

  private movieService = inject(MovieService);

  ngOnInit() {
    this.getMovies();
  }

  /**
   * Carga las películas desde el servicio y las asigna a la variable local `movies`.
   */
  getMovies(): void {
    this.movieService.getMovies().subscribe(data => {
      this.movies = data;
    });
  }
}
