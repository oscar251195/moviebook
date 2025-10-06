import {Component, OnInit, inject, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Movie} from '../../../../core/models/movie.model';
import {MovieService} from '../../../../core/services/movie.service';
import {MovieCardComponent} from '../../components/movie-card/movie-card.component';
import {Router, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCardComponent, RouterLink, MatButton, MatIcon],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  //1. Signal con las películas cargadas desde el servicio
  movies = this.movieService.movies;

  //2. Signals derivados del formulario
  filterForm = this.fb.group({
    search: [''],
    genre: ['']
  });

  // Convertimos los valueChanges de los controles a signals
  search = toSignal(this.filterForm.get('search')!.valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged()
  ), { initialValue: '' });

  genre = toSignal(this.filterForm.get('genre')!.valueChanges, { initialValue: '' });

  //3. Signal computado: lista filtrada
  filteredMovies = computed(() => {
    const query = (this.search() || '').toString().trim().toLowerCase();
    const genre = this.genre() || '';

    return this.movies().filter(movie => {
      const title = (movie.title || '').toString().toLowerCase();
      const matchesSearch = !query || title.includes(query);
      const matchesGenre = !genre || movie.genre === genre;
      return matchesSearch && matchesGenre;
    });
  });

  ngOnInit() {
    this.movieService.loadMovies().subscribe();
  }

  //Getter de géneros únicos
  get uniqueGenres(): string[] {
    return Array.from(new Set(this.movies().map(m => m.genre))).filter(Boolean);
  }

  addMovie(): void {
    this.router.navigate(['/movies/new']);
  }
}
