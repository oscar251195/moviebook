import { Routes } from '@angular/router';
import { MovieListComponent } from './features/movies/pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './features/movies/pages/movie-detail/movie-detail.component';
import { MovieFormComponent } from './features/movies/components/movie-form/movie-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },

  // Listado principal
  { path: 'movies', component: MovieListComponent },

  // Crear nueva película
  { path: 'movies/new', component: MovieFormComponent },

  // Editar película existente
  { path: 'movies/edit/:id', component: MovieFormComponent },

  // Detalle de película
  { path: 'movies/:id', component: MovieDetailComponent },

  // Ruta por defecto
  { path: '**', redirectTo: 'movies' },
];
