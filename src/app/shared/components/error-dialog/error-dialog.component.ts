import {Component, inject} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";

//Mostrar errores de carga
@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-green-600 transition"
              (click)="close()">Aceptar
      </button>
    </mat-dialog-actions>
  `
})
export class ErrorDialogComponent {
  private dialogRef = inject(MatDialogRef<ErrorDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  router = inject(Router);

  close() {
    this.dialogRef.close(true);
  }
}
