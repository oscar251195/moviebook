import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;

  //Función auxiliar para ejecutar el interceptor en un contexto de inyección
  const executeInterceptor = (req: HttpRequest<unknown>) => {
    //Espía con next para comprobar con qué argumentos se llama
    const next = jasmine.createSpy('next').and.callThrough();

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next);
    });

    //Se devuelve el espía
    return next;
  };

  beforeEach(() => {
    //Se crea espía para AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
      TestBed.runInInjectionContext(() => authInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  describe('when a token is available', () => {
    it('should add an Authorization header', () => {
      //Se simula que hay un token
      const fakeToken = 'my-secret-token';
      mockAuthService.getToken.and.returnValue(fakeToken);

      const request = new HttpRequest('GET', '/test');

      //Ejecutamos el interceptor
      const nextSpy = executeInterceptor(request);

      //Se verifica que se ha llamado a next
      expect(nextSpy).toHaveBeenCalled();

      //Se captura la petición
      const clonedRequest = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;

      //La petición se clona
      expect(clonedRequest).not.toBe(request);

      //Se verifica que la cabecera existe y el valor es correcto
      expect(clonedRequest.headers.has('Authorization')).toBe(true);
      expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    });
  });

  describe('when no token is available', () => {
    it('should not add an Authorization header', () => {
      //Sin token
      mockAuthService.getToken.and.returnValue(null);

      const request = new HttpRequest('GET', '/test');

      //Ejecutamos el interceptor
      const nextSpy = executeInterceptor(request);

      //Se verifica que se ha llamado a next
      expect(nextSpy).toHaveBeenCalled();

      //Se captura la petición
      const passedRequest = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;

      //Se comprueba que la petición debe de ser la misma instancia y no se ha clonado
      expect(passedRequest).toBe(request);

      //Se verifica que la cabecera NO es correcta
      expect(passedRequest.headers.has('Authorization')).toBe(false);
    });
  });
});
