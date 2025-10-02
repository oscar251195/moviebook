import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Movie} from "../../../../core/models/movie.model";

/**
 * Componente reutilizable que muestra la información de una sola película
 * en un formato de tarjeta.
 */

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  //Se recibe el objeto movie del padre
  @Input() movie!: Movie;
}
