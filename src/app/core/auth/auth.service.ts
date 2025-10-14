import {inject, Injectable, signal} from '@angular/core';
import {User} from "./auth.model";
import {Router} from "@angular/router";
import {delay, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));

  router = inject(Router);

  //Usuario guardado en localStorage (si existe)
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  //Simula un login. Comprueba credenciales y genera token falso. Se puede sustituir por una llamada HTTP real
  login(email: string, password: string) {
    // Simular un backend
    const validUser: User = { email: 'admin@moviebook.es', password: 'moviebook', name: 'Admin' };

    if (email === validUser.email && password === validUser.password) {
      const token = 'fake-jwt-token-' + Date.now();
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(validUser));
      this.currentUser.set(validUser);
      this.isAuthenticated.set(true);
      return of(true).pipe(delay(500));
    }

    return throwError(() => new Error('Credenciales incorrectas.'));
  }

  //Cierra sesión eliminando los datos almacenados
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  //Devuelve token actual (si existe)
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

}
