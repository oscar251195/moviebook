import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
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
  private apiUrl = 'http://localhost:3000/movies';

  //Inyección del httpclient para peticiones web
  private http = inject(HttpClient);

  constructor() { }

  //Recupera la lista completa de películas del API. Devuelve un observable que emite un array de pelis
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  //Recupera una única película del API usando el ID. Devuelve observable que emite la peli encontrada
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  //Envía una peli al API para crearla. Se le envía el objeto película a añadir sin ID. Devuelve un observable con la peli creada.
  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  //Actualiza una peli existente. Devuelve un observable con esta actualizada
  updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, movie);
  }

  //Elimina una película usando su ID. Devuelve un observable que se completa cuando la operación termina. No emite valor.
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
