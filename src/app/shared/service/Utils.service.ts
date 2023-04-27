import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  patch(object: any, target: any): void {
    if(typeof object !== typeof target || JSON.stringify(object) !== JSON.stringify(target))
      return;

    if(typeof object === 'object')
    {

    }
    else
    {
      
    }
  }
}
