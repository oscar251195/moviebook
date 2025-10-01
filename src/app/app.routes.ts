import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: 'movies' }
];
