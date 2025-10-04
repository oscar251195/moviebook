import { Routes } from '@angular/router';
import {MovieListComponent} from "./features/movies/pages/movie-list/movie-list.component";
import {MovieDetailComponent} from "./features/movies/pages/movie-detail/movie-detail.component";

export const routes: Routes = [
  {
    path: 'movies',
    loadChildren: () =>
      import('./features/movies/movies.routes').then(r => r.MOVIES_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: 'movies' }
];
