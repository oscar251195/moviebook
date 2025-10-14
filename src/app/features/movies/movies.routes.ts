// src/app/features/movies/movies.routes.ts
import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import {MovieFormComponent} from "./components/movie-form/movie-form.component";

// Exportamos el array de rutas
export const MOVIES_ROUTES: Routes = [
  {
    // Corresponde a la URL '/movies'
    path: '',
    component: MovieListComponent
  },
  {
    // Corresponde a '/movies/new'
    path: 'new',
    component: MovieFormComponent
  },
  {
    // Corresponde a '/movies/edit/:id'
    path: 'edit/:id',
    component: MovieFormComponent
  },
  {
    // Corresponde a '/movies/:id'
    path: ':id',
    component: MovieDetailComponent
  }
];
