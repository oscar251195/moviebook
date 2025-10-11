import {HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import {catchError, throwError} from "rxjs";

//Capturar automáticamente los errores de API y mostrar el mensaje correspondiente sin añadir error en cada subscribe
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error desconocido.';
      if (error.status === 0) message = 'No hay conexión con el servidor.';
      else if (error.status === 404) message = 'Recurso no encontrado.';
      else if (error.status === 500) message = 'Error interno del servidor.';
      else if (error.error?.message) message = error.error.message;

      notify.error(message);
      return throwError(() => error);
    })
  );
};
