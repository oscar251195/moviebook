import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MovieService} from "../../../../core/services/movie.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Movie} from "../../../../core/models/movie.model";


@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //Formulario
  formGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
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
    console.log('Hola');
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    if (id) {
      this.editing.set(true);
      this.loadMovie(+id);
    }
  }

  //Cargar película existente
  loadMovie(id: number) {
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
      this.movieService.updateMovie(movieData).subscribe({
        next: () => this.router.navigate(['/movies']),
        error: (err) => console.error('Error actualizando: ', err),
      });
    } else {
      this.movieService.addMovie(movieData).subscribe({
        next: () => this.router.navigate(['/movies']),
        error: (err) => console.error('Error creando: ', err),
      });
    }
  }

  //Cancelar
  cancel() {
    this.router.navigate(['/movies']);
  }

}
