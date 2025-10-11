import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ErrorDialogComponent>>;

  const mockData = {
    title: 'Unexpected Error',
    message: 'Something went wrong, please try again later.'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the error dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement.textContent.trim();
    const messageEl = fixture.debugElement.query(By.css('mat-dialog-content p')).nativeElement.textContent.trim();

    expect(titleEl).toBe(mockData.title);
    expect(messageEl).toBe(mockData.message);
  });

  it('should close the dialog when clicking the Close button', () => {
    const closeButton = fixture.debugElement.query(By.css('button')).nativeElement;
    closeButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call close() method manually and close the dialog', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should render the dialog with correct structure', () => {
    const title = fixture.debugElement.query(By.css('h2')).nativeElement;
    const content = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement;
    const actions = fixture.debugElement.query(By.css('mat-dialog-actions')).nativeElement;

    expect(title).toBeTruthy();
    expect(content).toBeTruthy();
    expect(actions).toBeTruthy();
  });
});
