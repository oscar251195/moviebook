import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {AuthService} from '../../../core/auth/auth.service';
import {NotificationService} from '../../../core/services/notification.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  // Usaremos un Subject para un control explícito del flujo asíncrono.
  let loginSubject: Subject<boolean>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    loginSubject = new Subject<boolean>();
    mockAuthService.login.and.returnValue(loginSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, ReactiveFormsModule, NoopAnimationsModule,
        MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
      ],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter},
        {provide: NotificationService, useValue: mockNotificationService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.form.valid).toBeFalsy();
  });

  describe('when submitting the form', () => {
    beforeEach(() => {
      // Rellenamos el formulario para que sea válido para todos los tests de envío.
      component.form.setValue({email: 'test@test.com', password: 'password'});
    });

    it('should set loading to true while the request is in flight', () => {
      // Estado inicial
      expect(component.loading).toBe(false);

      // Act
      component.onSubmit();

      // Assert: loading debe ser true inmediatamente después de la llamada.
      expect(component.loading).toBe(true);
    });

    it('should set loading to false on successful completion', () => {
      component.onSubmit();

      // Verificamos el estado intermedio
      expect(component.loading).toBe(true);

      // Simulamos la respuesta exitosa
      loginSubject.next(true);
      loginSubject.complete();

      // Assert: El 'finalize' se ha ejecutado, loading debe ser false.
      expect(component.loading).toBe(false);
    });

    it('should set loading to false on error', () => {
      component.onSubmit();

      // Verificamos el estado intermedio
      expect(component.loading).toBe(true);

      // Simulamos una respuesta de error
      loginSubject.error(new Error('Failed login'));

      // Assert: El 'finalize' también se ha ejecutado en caso de error.
      expect(component.loading).toBe(false);
    });

    it('should navigate and show success notification on success', () => {
      component.onSubmit();

      loginSubject.next(true);
      loginSubject.complete();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/movies']);
      expect(mockNotificationService.success).toHaveBeenCalledWith('¡Bienvenido!');
    });

    it('should not navigate but show error notification on failure', () => {
      component.onSubmit();

      loginSubject.error(new Error('Failed login'));

      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('Credenciales incorrectas.');
    });
  });
});
