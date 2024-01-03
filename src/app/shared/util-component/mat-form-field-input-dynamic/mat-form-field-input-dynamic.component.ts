import { Component, Input, SimpleChanges, forwardRef } from '@angular/core';
import { MatFormFieldComponent } from '../mat-form-field/mat-form-field.component';
import { MatFromFieldInputDynamicItem, MatItemSetting, MatItemSettingType, MatOption } from '../../model/Mat.model';

@Component({
  selector: 'app-mat-form-field-input-dynamic',
  templateUrl: './mat-form-field-input-dynamic.component.html',
  styleUrls: ['./mat-form-field-input-dynamic.component.scss'],
  providers: [{ provide: MatFormFieldComponent, useExisting: forwardRef(() => MatFormFieldInputDynamicComponent) }],
})
export class MatFormFieldInputDynamicComponent extends MatFormFieldComponent {

  @Input()
  isPassword: boolean = false;

  @Input()
  isEmail: boolean = false;

  @Input()
  isTextArea: boolean = false;
  
  validInput: boolean = false;

  // mat option
  options: MatOption[] = [
    {
      value: true,
      valueLabel: "TRUE"
    },
    {
      value: false,
      valueLabel: "FALSE"
    }
  ];

  //dynamic type
  @Input()
  objectLabel?: string;

  items: MatFromFieldInputDynamicItem[] = [];

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    if(!this.blankObject)
      this.blankObject = this.value;

    this.init();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  init() {
    if(this.isValueObject() && this.blankObject && !this.isValueArray())
      this.parseItems();
  }

  override isValidInput(): boolean {
    return this.validInput;
  }

  //dynamic object
  parseItems () {
    this.items = [];
    let defaultIndex = 100;

    //check if value is null or undefine
    if(!this.value) {
      this.value = structuredClone(this.blankObject);
      Object.setPrototypeOf(this.value , this.blankObject);
    }

    for (const [key, value] of Object.entries(this.value)) {
      if(!this.isHide(key))
        this.items.push(new MatFromFieldInputDynamicItem(this.value, this.getKeyBlankObject(key), key, this.getValue(key, value), this.getSetting(key), this.getIndex(key, defaultIndex)));
      defaultIndex++;
    }
    this.items = this.items.sort((a, b) => a.index! - b.index!);
  }

  private getKeyBlankObject(key: string) {
    let blankObj = this.blankObject[key];
    if(Array.isArray(blankObj)) {
      if(blankObj.length > 0)
        return blankObj[0];
      else 
        throw new Error("blank object array type can't define\nPlease add and empty element to array inside object field")
    }
    else
      return blankObj;
  }

  private getValue(key: string, value: any) {
    if(value)
      return value;
    else return this.getKeyBlankObject(key);
  }

  private getIndex(key: string, defaultIndex: number): number {
    let prototype = Object.getPrototypeOf(this.blankObject!);
    let name = key + MatItemSettingType.INDEX.toString();
    if (Object.hasOwn(prototype, name))
      return prototype[name];
    else
      return defaultIndex;
  }

  private getSetting(key: string): MatItemSetting[] {
    let prototype = Object.getPrototypeOf(this.blankObject!);
    let settings: MatItemSetting[] = [];

    for(let type in MatItemSettingType) {
      let name = key + type;
      if (Object.hasOwn(prototype, name) && !!prototype[name])
        settings.push(new MatItemSetting(type));
    }

    return settings;
  }



  private isHide(key: string): boolean {
    let prototype = Object.getPrototypeOf(this.blankObject!);
    let name = key + MatItemSettingType.HIDE.toString();
    return Object.hasOwn(prototype, name) && !!prototype[name];
  }

  public containHide(item: MatFromFieldInputDynamicItem) {
    return item.containSetting(MatItemSettingType.HIDE);
  }

  public containRequire(item: MatFromFieldInputDynamicItem) {
    return item.containSetting(MatItemSettingType.REQUIRE);
  }

  public containDisable(item: MatFromFieldInputDynamicItem) {
    return item.containSetting(MatItemSettingType.DISABLE);
  }
}