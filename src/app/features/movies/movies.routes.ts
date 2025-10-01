// src/app/features/movies/movies.routes.ts
import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';

// Exportamos el array de rutas
export const MOVIES_ROUTES: Routes = [
  { path: '', component: MovieListComponent },
  { path: ':id', component: MovieDetailComponent }
];
