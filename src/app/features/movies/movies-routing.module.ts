import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MovieListComponent} from "./pages/movie-list/movie-list.component";
import {MovieDetailComponent} from "./pages/movie-detail/movie-detail.component";

const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: ':id', component: MovieDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
