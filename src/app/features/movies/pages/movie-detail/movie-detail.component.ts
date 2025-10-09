import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
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
    this.movieService.getMovieById(id).subscribe((data => {
      this.movie = data;
    }));
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

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
