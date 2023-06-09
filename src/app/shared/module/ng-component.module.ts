import { NgModule } from '@angular/core';
import { CopyToClipboardUtilComponent } from '../util-component/copy-to-clipboard-util/copy-to-clipboard-util.component';
import { InputTypeSwitchComponent } from '../util-component/input-type-switch/input-type-switch.component';
import { MatFormFieldInputComponent } from '../util-component/mat-form-field-input/mat-form-field-input.component';
import { NgEssentialModule } from './ng-essential.module';
import { NgMaterialModule } from './ng-material.module';
import { CopyToClipboardDirective } from '../directive/copy-to-clipboard.directive';
import { FilterNamePipe } from '../pipes/filter-name.pipe';
import { FilterNameReversePipe } from '../pipes/filter-name-reverse.pipe';
import { MatTableComponent } from '../util-component/mat-table/mat-table.component';
import { MatFormFieldGroupDirective } from '../directive/mat-form-field-group.directive';
import { MatFormFieldTextAreaComponent } from '../util-component/mat-form-field-text-area/mat-form-field-text-area.component';
import { MatFormFieldComponent } from '../util-component/mat-form-field/mat-form-field.component';
import { MatFormFieldInputTimeComponent } from '../util-component/mat-form-field-input-time/mat-form-field-input-time.component';
import { MatFormFieldInputOptionComponent } from '../util-component/mat-form-field-input-option/mat-form-field-input-option.component';

@NgModule({
  declarations: [
    CopyToClipboardUtilComponent,
    InputTypeSwitchComponent,
    MatFormFieldInputComponent,
    CopyToClipboardDirective,
    FilterNamePipe,
    FilterNameReversePipe,
    MatTableComponent,
    MatFormFieldComponent,
    MatFormFieldGroupDirective,
    MatFormFieldTextAreaComponent,
    MatFormFieldInputTimeComponent,
    MatFormFieldInputOptionComponent
  ],
  imports: [
    NgMaterialModule,
    NgEssentialModule
  ],
  exports: [
    CopyToClipboardUtilComponent,
    InputTypeSwitchComponent,
    MatFormFieldInputComponent,
    CopyToClipboardDirective,
    FilterNamePipe,
    FilterNameReversePipe,
    MatTableComponent,
    MatFormFieldComponent,
    MatFormFieldGroupDirective,
    MatFormFieldTextAreaComponent,
    MatFormFieldInputTimeComponent,
    MatFormFieldInputOptionComponent
  ]
})
export class NgComponentModule { }
