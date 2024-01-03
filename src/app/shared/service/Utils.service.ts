import { Injectable, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, first } from 'rxjs';

export interface File {
  name: string,
  type: string,
  extension: string,
  rawFile?: globalThis.File;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  static async getRouteParam(route: ActivatedRoute, variable: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      route.params.pipe(first()).subscribe(
        params => {
          let value = params[variable];
          resolve(value);
        },
        error => { reject('') }
      );
    })
  }

  patch(object: any, target: any): void {
    if (typeof object !== typeof target || JSON.stringify(object) !== JSON.stringify(target))
      return;

    if (typeof object === 'object') {

    }
    else {

    }
  }

  saveFile(fileName: string, fileType: string, fileContent: string) {
    const file = new Blob([fileContent], { type: fileType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  }

  async uploadFile(accept: string): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      let fileInput = document.createElement("input");
      fileInput.accept = accept;
      fileInput.type = 'file';
      fileInput.click();

      fileInput.onchange = (e) => {
        let rawFile = fileInput.files![0];
        let fileName = rawFile.name;
        let fileType = rawFile.type;
        let lastIndex = fileName.lastIndexOf('.') > 0 ? fileName.lastIndexOf('.') + 1 : fileName.length;
        let extension = fileName.substring(lastIndex);

        let reader = new FileReader();

        reader.onload = () => {
          let value: string = reader.result && typeof reader.result === 'string' ? reader.result : '';
          let file: File = {
            name: fileName,
            type: fileType,
            rawFile: rawFile,
            value: value,
            extension: extension
          }

          fileInput.remove();
          resolve(file);
        };
        reader.readAsText(rawFile);
      };
    });
  }

  static isNotEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) !== JSON.stringify(obj2);
  }

  static isEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  static localStorageSetItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static localStorageGetItem<T>(key: string): T | null {
    let value = localStorage.getItem(key);
    if(value) {
      let parseValue: T = JSON.parse(value);
      return parseValue;
    }

    return null;
  }

  static async ObservableToPromise<T>(observable: Observable<T>, nextFn?: (value: T) => void, errorFn?: (error: any) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      observable.pipe(first()).subscribe({
        next: (v) => {
          if(nextFn)
            nextFn(v);
          resolve(v);
        },
        error: (e) => {
          if(errorFn)
            errorFn(e);
          reject(e);
        }
      })
    })
  }

  static fixPrototype<T>(classEntity: any) {
    return <T>(source: Observable<T>): Observable<T> => {
      return new Observable(subscriber => {
        source.subscribe({
          next(value) {
            if(value !== undefined && value !== null) {
              Object.setPrototypeOf(value, classEntity.prototype);
            }
            subscriber.next(value);
          },
          error(error) {
            subscriber.error(error);
          },
          complete() {
            subscriber.complete();
          }
        })
      });
    };
  } 

  static createObject<T>(_createClass: {new (): T}): T {
    return new _createClass();
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}