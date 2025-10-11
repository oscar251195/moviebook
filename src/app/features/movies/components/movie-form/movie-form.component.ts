import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MovieService} from "../../../../core/services/movie.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Movie} from "../../../../core/models/movie.model";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notify = inject(NotificationService);

  //Formulario
  formGroup = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    description: ['', Validators.required],
    year: [2024, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    genre: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    image_url: [''],
  })

  // Signal del modo actual (crear o editar)
  editing = signal(false);

  // Signal con la película que estamos editando
  movie = signal<Movie | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing.set(true);
      this.loadMovie(id);
    }
  }

  //Cargar película existente
  loadMovie(id: string) {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.formGroup.patchValue(movie);
      },
      error: (err) => console.error('Error cargando película: ', err),
    });
  }
  //Enviar form
  onSubmit() {
    if (this.formGroup.invalid) return;

    const movieData: Movie = {...this.movie(), ...this.formGroup.value} as Movie;

    if (this.editing()) {
      //Edición
      this.movieService.updateMovie(movieData).subscribe({
        next: () => {
          this.notify.success('Película actualizada correctamente.');
          this.router.navigate(['/movies']);
        },
        error: () => this.notify.error('Error al actualizar la película.'),
      });
    } else {
      //Creación
      const movies = this.movieService.movies();
      const maxId = movies.length ? Math.max(...movies.map(m => Number(m.id))) : 0;
      const newId = (maxId + 1).toString(); // json-server espera string

      const newMovie: Movie = {
        ...this.formGroup.value,
        id: newId
      } as Movie;

      this.movieService.addMovie(newMovie).subscribe({
        next: () => {
          this.notify.success('Película creada correctamente.');
          this.router.navigate(['/movies']);
        },
        error: () => this.notify.error('Error al crear la película.'),
      });
    }
  }

  //Cancelar
  cancel() {
    this.router.navigate(['/movies']);
  }

}
