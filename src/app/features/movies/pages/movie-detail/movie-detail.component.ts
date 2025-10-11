import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MovieService} from "../../../../core/services/movie.service";
import {Movie} from "../../../../core/models/movie.model";
import {
  MatCard, MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {ConfirmDialogComponent} from "../../components/movie-form/movie-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../../../shared/components/error-dialog/error-dialog.component";

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatChipSet, MatChip, MatCardImage, MatCardContent, MatCardActions, MatIcon],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {

  //Inyecciones
  private ruta = inject(ActivatedRoute)
  private movieService = inject(MovieService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  movie?: Movie

  ngOnInit(): void {
    //Recuperar el id
    const id = this.ruta.snapshot.paramMap.get('id');
    if (!id) return;
    //Acceder a la película mediante su método por ID
    this.movieService.getMovieById(id).subscribe({
      next: data => {
        if (!data) {
          // Si getMovieById devuelve undefined (película no encontrada)
          this.showNotFoundDialogAndRedirect();
        } else {
          this.movie = data;
        }
      },
      // El interceptor ya maneja el error, pero por si acaso
      error: () => this.showNotFoundDialogAndRedirect()
    });
  }

  editMovie(id: string) {
    this.router.navigate(['movies/edit/', id]);
  }

  deleteMovie(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.deleteMovie(id).subscribe({
          next: () => this.router.navigate(['movies/']),
          error: err => console.error('Error eliminando la película: ', err)
        });
      }
    })
  }

  //Diálogo cuando la película no existe
  showNotFoundDialogAndRedirect(): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
        title: 'Película no encontrada',
        message: 'La película que buscas no existe. Serás redirigido a la lista principal.'
      }
    });

    // Escuchamos a que el diálogo se cierre
    dialogRef.afterClosed().subscribe(result => {
      // Si se cerró (result no es undefined), navegamos
      this.router.navigate(['/movies']);
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
