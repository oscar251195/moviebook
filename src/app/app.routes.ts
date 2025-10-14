import {Routes} from '@angular/router';
import {LoginComponent} from "./features/auth/login/login.component";
import {authGuard} from "./core/auth/auth.guard";
import {LayoutComponent} from "./shared/layout/layout.component";

export const routes: Routes = [

  //Ruta para el login (no usa layout y no está protegido)
  {path: 'login', component: LoginComponent},

  // Listado principal (se usa layout y están protegidas)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'movies',
        loadChildren: () =>
          import('./features/movies/movies.routes').then(m => m.MOVIES_ROUTES),
      },
      {path: '', redirectTo: 'movies', pathMatch: 'full'},
    ],
  },
  // Ruta por defecto
  {path: '**', redirectTo: 'movies'},
];
