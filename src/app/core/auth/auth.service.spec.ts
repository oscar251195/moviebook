import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from './auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  const VALID_USER: User = {
    email: 'admin@moviebook.es',
    password: 'moviebook',
    name: 'Admin',
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);

    // Reset localStorage before each test
    localStorage.clear();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if no user in localStorage', () => {
    const user = (service as unknown as { getUserFromStorage(): User | null }).getUserFromStorage();
    expect(user).toBeNull();
  });

  it('should return a parsed user if user exists in localStorage', () => {
    localStorage.setItem('auth_user', JSON.stringify(VALID_USER));
    const user = (service as unknown as { getUserFromStorage(): User | null }).getUserFromStorage();
    expect(user).toEqual(VALID_USER);
  });

  it('should login successfully with valid credentials', async () => {
    const result = await firstValueFrom(service.login(VALID_USER.email, VALID_USER.password));

    expect(result).toBeTrue();
    expect(localStorage.getItem('auth_token')).toContain('fake-jwt-token-');
    expect(localStorage.getItem('auth_user')).toEqual(JSON.stringify(VALID_USER));
    expect(service.currentUser()).toEqual(VALID_USER);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should throw an error with invalid credentials', (done) => {
    service.login('wrong@email.com', 'badpass').subscribe({
      next: () => fail('Expected an error'),
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('Credenciales incorrectas.');
        expect(service.isAuthenticated()).toBeFalse();
        expect(localStorage.getItem('auth_token')).toBeNull();
        done();
      },
    });
  });

  it('should clear all auth data on logout', async () => {
    // Se simula login
    await firstValueFrom(service.login(VALID_USER.email, VALID_USER.password));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return token if exists', async () => {
    await firstValueFrom(service.login(VALID_USER.email, VALID_USER.password));

    const token = service.getToken();
    expect(token).toContain('fake-jwt-token-');
  });

  it('should return null token if not logged in', () => {
    const token = service.getToken();
    expect(token).toBeNull();
  });

  it('should set isAuthenticated correctly when initialized with token', () => {
    localStorage.clear();
    localStorage.setItem('auth_token', 'existing-token');

    // Creamos una nueva instancia del servicio mediante TestBed
    const newService = TestBed.runInInjectionContext(() => new AuthService());

    expect(newService.isAuthenticated()).toBeTrue();
  });

});
