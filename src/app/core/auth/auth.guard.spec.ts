import {TestBed} from '@angular/core/testing';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthService} from './auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Creamos simuladores para los argumentos del guard que no usaremos
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {
    // Creamos los espías para nuestras dependencias
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        // Proveemos los mocks para que 'inject()' pueda encontrarlos
        {provide: AuthService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter}
      ]
    });
  });

  it('should be created', () => {
    //Un test simple para asegurar que se puede ejecutar en el contexto de inyección
    const result = TestBed.runInInjectionContext(() => {
      //Para un test de creación, no necesitamos preparar los mocks
      //Simplemente comprobamos que no falle al ejecutarse
      return authGuard(dummyRoute, dummyState);
    });
    //No podemos hacer un expect directo del guard, pero si llega aquí sin error, está bien.
    expect(result).toBeDefined();
  });

  describe('when user is authenticated', () => {
    it('should return true and allow navigation', () => {
      //Simulamos que el usuario está autenticado
      mockAuthService.isAuthenticated.and.returnValue(true);

      //Ejecutamos el guard DENTRO del contexto de inyección
      const canActivate = TestBed.runInInjectionContext(() => {
        return authGuard(dummyRoute, dummyState);
      });

      expect(canActivate).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled(); // Verificamos que NO se redirige
    });
  });

  describe('when user is not authenticated', () => {
    it('should return false and redirect to /login', () => {
      //Simulamos que el usuario NO está autenticado
      mockAuthService.isAuthenticated.and.returnValue(false);

      //Ejecutamos el guard
      const canActivate = TestBed.runInInjectionContext(() => {
        return authGuard(dummyRoute, dummyState);
      });

      // Assert
      expect(canActivate).toBe(false);
      //Verificamos que SÍ redirige
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
