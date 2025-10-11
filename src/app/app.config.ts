import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {errorInterceptor} from "./core/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de Angular para detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Cliente HTTP disponible en toda la app
    provideHttpClient(withInterceptors([errorInterceptor])),

    // Enrutado de la aplicación (usamos el archivo de rutas que definimos antes)
    provideRouter(routes),

    //Inyección de dependencias para habilitar las animaciones en la aplicación
    provideAnimations()
  ],
};
