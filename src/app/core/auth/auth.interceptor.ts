import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

//Inserta el token JWT en el encabezado de Authorization si el usuario está autenticado
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
