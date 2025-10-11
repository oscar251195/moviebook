import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error']);
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
  });

  const createHandler = (response$: any): HttpHandlerFn => {
    return (req: HttpRequest<any>) => response$;
  };

  it('should call NotificationService.error() when server is unreachable (status 0)', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    const req = new HttpRequest('GET', '/test');
    const next = createHandler(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: () => {
          expect(notificationServiceSpy.error).toHaveBeenCalledWith('No hay conexión con el servidor.');
          done();
        }
      });
    })

  });

  it('should call NotificationService.error() with 404 message', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    const req = new HttpRequest('GET', '/missing');
    const next = createHandler(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req,next).subscribe({
        error: () => {
          expect(notificationServiceSpy.error).toHaveBeenCalledWith('Recurso no encontrado.');
          done();
        }
      });
    })

  });

  it('should call NotificationService.error() with 500 message', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    const req = new HttpRequest('GET', '/server-error');
    const next = createHandler(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: () => {
          expect(notificationServiceSpy.error).toHaveBeenCalledWith('Error interno del servidor.');
          done();
        }
      });
    })

  });

  it('should call NotificationService.error() with custom message from server', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: { message: 'Custom API error' }
    });
    // Le pasamos 'null' como tercer argumento para indicar que el cuerpo está vacío.
    const req = new HttpRequest('POST', '/api', null);
    const next = createHandler(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: () => {
          expect(notificationServiceSpy.error).toHaveBeenCalledWith('Custom API error');
          done();
        }
      });
    })

  });

  it('should rethrow the error after handling it', (done) => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const req = new HttpRequest('GET', '/server-error');
    const next = createHandler(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        }
      });
    })

  });
});
