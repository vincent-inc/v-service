import { Injectable } from '@angular/core';
import { ViesRestService } from './Rest.service';
import { TTS } from '../model/AI.model';
import { HttpClient } from '@angular/common/http';
import { AuthenticatorService } from './Authenticator.service';
import { UtilsService } from './Utils.service';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaphaelTTSService extends ViesRestService<TTS> {

  constructor(httpClient: HttpClient, private authenticatorService: AuthenticatorService) {
    super(httpClient);
  }

  protected override getPrefixes(): string[] {
    return ['raphael', 'tts'];
  }

  async checkValidUrl(url: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let request = this.httpClient.get(url, {observe: 'response', responseType: 'blob'}).pipe(first());
      let valid = await UtilsService.ObservableToPromise(request);
      let isValid = valid.status === 200;
      if(isValid)
        resolve();
      else
        reject();
    }); 
    
  }

  getWavById(id: number) {
    let request = this.httpClient.get(`${this.getURI()}${this.getPrefixPath()}/wav/${id}`, {observe: 'response', responseType: 'blob'}).pipe(first());
    return UtilsService.ObservableToPromise(request);
  }

  public generateSpeakWavLink(text: string): string {
    return `${this.getURI()}${this.getPrefixPath()}/wav?text=${text}&authorization=${this.authenticatorService.getJwt()}`;
  }

  public generateSpeakWavLinkWithId(id: number): string {
    return `${this.getURI()}${this.getPrefixPath()}/wav/${id}?authorization=${this.authenticatorService.getJwt()}`;
  }
}
