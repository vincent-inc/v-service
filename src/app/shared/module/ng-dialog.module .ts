import { NgModule } from '@angular/core';
import { ConfirmDialog } from '../dialog/confirm-dialog/confirm-dialog.component';
import { InputDialog } from '../dialog/input-dialog/input-dialog.component';
import { NgMaterialModule } from './ng-material.module';
import { NgEssentialModule } from './ng-essential.module';

@NgModule({
  declarations: [
    ConfirmDialog,
    InputDialog,
  ],
  imports: [
    NgMaterialModule,
    NgEssentialModule
  ],
  exports: [
    ConfirmDialog,
    InputDialog,
  ]
})
export class NgDialogModule { }
