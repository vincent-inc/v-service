import { NgModule } from '@angular/core';
import { ConfirmDialog } from '../dialog/confirm-dialog/confirm-dialog.component';
import { InputDialog } from '../dialog/input-dialog/input-dialog.component';
import { NgMaterialModule } from './ng-material.module';
import { NgEssentialModule } from './ng-essential.module';
import { NgComponentModule } from './ng-component.module';
import { LobbyDialog } from '../dialog/lobby-dialog/lobby-dialog.component';
import { UserDialog } from '../dialog/user-dialog/user-dialog.component';
import { QuestionDialog } from '../dialog/question-dialog/question-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialog,
    InputDialog,
    LobbyDialog,
    UserDialog,
    QuestionDialog
  ],
  imports: [
    NgMaterialModule,
    NgEssentialModule,
    NgComponentModule
  ],
  exports: [
    ConfirmDialog,
    InputDialog,
    LobbyDialog,
    UserDialog,
    QuestionDialog
  ]
})
export class NgDialogModule { }
