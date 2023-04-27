import { NgModule } from '@angular/core';
import { CopyToClipboardUtilComponent } from '../util-component/copy-to-clipboard-util/copy-to-clipboard-util.component';
import { InputTypeSwitchComponent } from '../util-component/input-type-switch/input-type-switch.component';
import { MatFormFieldInputComponent } from '../util-component/mat-form-field-input/mat-form-field-input.component';
import { NgEssentialModule } from './ng-essential.module';
import { NgMaterialModule } from './ng-material.module';
import { CopyToClipboardDirective } from '../directive/copy-to-clipboard.directive';

@NgModule({
  declarations: [
    CopyToClipboardUtilComponent,
    InputTypeSwitchComponent,
    MatFormFieldInputComponent,
    CopyToClipboardDirective
  ],
  imports: [
    NgMaterialModule,
    NgEssentialModule
  ],
  exports: [
    CopyToClipboardUtilComponent,
    InputTypeSwitchComponent,
    MatFormFieldInputComponent,
    CopyToClipboardDirective
  ]
})
export class NgComponentModule { }
