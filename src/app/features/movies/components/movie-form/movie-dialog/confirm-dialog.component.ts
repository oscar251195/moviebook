import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatDialogTitle, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>
      <p>¿Seguro que deseas eliminar esta película? Esta acción no se puede deshacer.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-green-600 transition" (click)="cancel()">Cancelar</button>
      <button
        type="button"
        class="flex items-center ml-2 gap-2 px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-black transition" (click)="confirm()">Eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  //Cancelar
  cancel() {
    this.dialogRef.close(false);
  }

  //Confirmar
  confirm() {
    this.dialogRef.close(true);
  }
}
