import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should display a success message with correct configuration', () => {
    service.success('Operation completed');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Operation completed',
      'Aceptar',
      jasmine.objectContaining({
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

  it('should display an error message with correct configuration', () => {
    service.error('An error occurred');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'An error occurred',
      'Cerrar',
      jasmine.objectContaining({
        duration: 4000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });
});
