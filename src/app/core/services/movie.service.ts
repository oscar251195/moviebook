import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Movie} from "../models/movie.model";

/**
 * Servicio central para gestionar las operaciones de datos de las películas.
 * Abstrae toda la lógica de comunicación HTTP con el backend (API).
 */

@Injectable({
  //Este servicio es singleton. Angular crea una única instancia de MovieService en toda la aplicación
  providedIn: 'root'
})
export class MovieService {

  // Endpoint del JSON Server
  private apiUrl = 'http://localhost:3001/movies';

  //Inyección del httpclient para peticiones web
  private http = inject(HttpClient);

  //Signal reactivo que guarda la lista de películas
  movies = signal<Movie[]>([]);


  /**
   * Carga inicial desde la API y actualiza el signal `movies`.
   */
  loadMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      map(data => data.map(movie => ({ ...movie, id: movie.id }))),
      tap(data => this.movies.set(data))
    );
  }

  /**
   * Obtiene una película concreta por su ID (sin afectar al signal principal).
   */
  getMovieById(id: string) {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      map(movie => ({ ...movie, id: movie.id }))
    );
  }


  /**
   * Añade una nueva película al servidor y actualiza el signal local.
   */
  addMovie(movie: Movie) {
    return this.http.post<Movie>(this.apiUrl, movie).pipe(
      tap(newMovie => this.movies.update(movies => [...movies, newMovie]))
    );
  }

  /**
   * Actualiza una película existente en el servidor y en el signal local.
   */
  updateMovie(movie: Movie) {
    return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, movie).pipe(
      tap(updated => this.movies.update(movies =>
        movies.map(m => m.id === updated.id ? updated : m)
      ))
    );
  }

  /**
   * Elimina una película del servidor y la quita del signal local.
   */
  deleteMovie(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.movies.update(movies => movies.filter(m => m.id !== id)))
    );
  }

}
