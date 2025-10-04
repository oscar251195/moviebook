import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de Angular para detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Cliente HTTP disponible en toda la app
    provideHttpClient(),

    // Enrutado de la aplicación (usamos el archivo de rutas que definimos antes)
    provideRouter(routes),
  ],
};
