import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Movie} from '../../../../core/models/movie.model';
import {MovieService} from '../../../../core/services/movie.service';
import {MovieCardComponent} from '../../components/movie-card/movie-card.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCardComponent, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private fb = inject(FormBuilder);

  // Datos "originales" cargados desde el servicio
  movies: Movie[] = [];
  // Lista que realmente mostramos (filtrada)
  filteredMovies: Movie[] = [];

  // Formulario reactivo con search + genre
  filterForm = this.fb.group({
    search: [''],
    genre: ['']
  });

  ngOnInit() {
    // Cargamos películas
    this.getMovies();

    // Escuchamos cambios del input de búsqueda
    this.filterForm.get('search')!.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(search => {
        this.applyFilters(search ?? '', this.filterForm.get('genre')!.value ?? '');
      });

    // Escuchamos cambios del desplegable de género
    this.filterForm.get('genre')!.valueChanges
      .subscribe(genre => {
        this.applyFilters(this.filterForm.get('search')!.value ?? '', genre ?? '');
      });
  }

  getMovies(): void {
    this.movieService.getMovies().subscribe(data => {
      // Guardamos la lista original
      this.movies = data || [];
      // Inicialmente mostramos todas
      this.filteredMovies = [...this.movies];
    });
  }

  //Se aplican los filtros
  applyFilters(search: string, genre: string) {
    //Búsqueda
    const query = (search || '').toString().trim().toLowerCase();

    this.filteredMovies = this.movies.filter(movie => {
      //Si hay título le quita espacios y lo deja en minus
      const title = (movie.title || '').toString().toLowerCase();
      //Si la búsqueda es vacía (no se busca nada) no se aplica el filtro
      //Si hay búsqueda, comprueba que el título incluya la cadena que se busca
      const matchesSearch = !query || title.includes(query);
      //Si no hay género seleccionado pasa todos
      //Si hay género, sólo pasan los que lo tengan
      const matchesGenre = !genre || genre === '' || movie.genre === genre;
      //Sólo las películas que cumplan búsqueda y género se conservan
      return matchesSearch && matchesGenre;
    });
  }

  // Getter que devuelve géneros únicos tomando como fuente this.movies
  get uniqueGenres(): string[] {
    // Usamos Set para obtener únicos y mantener el orden de aparición
    return Array.from(new Set(this.movies.map(m => m.genre))).filter(Boolean);
  }
}
