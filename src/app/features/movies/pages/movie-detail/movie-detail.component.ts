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
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatChipSet, MatChip, MatCardImage, MatCardContent, MatCardActions, MatButton, RouterLink, MatIcon],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {

  //Inyecciones
  private ruta = inject(ActivatedRoute)
  private movieService = inject(MovieService);
  private router = inject(Router);

  movie?: Movie

  ngOnInit(): void {
    //Recuperar el id
    const id = Number(this.ruta.snapshot.paramMap.get('id'));

    //Acceder a la película mediante su método por ID
    this.movieService.getMovieById(id).subscribe((data => {
      this.movie = data;
    }))
  }

  editMovie(id: number) {
    this.router.navigate(['movies/edit/', id]);
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
