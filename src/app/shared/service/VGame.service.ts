import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../model/VGame.model';
import { SettingService } from './Setting.service';
import HttpClientUtils from '../model/HttpClientUtils.model';

@Injectable({
  providedIn: 'root'
})
export class VGameService {

  private prefix = "vgame"

  constructor(
    private httpClient: HttpClient,
    private settingService: SettingService,
  ) { }
  
  // Question
  public getAnyMatchQuestions(question: Question): Observable<Question[]> {
    let params = HttpClientUtils.toHttpParams(question);

    return this.httpClient.get<Question[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions/match_any`, {params: params});
  }

  public getQuestions(): Observable<Question[]> {
    return this.httpClient.get<Question[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions`);
  }

  public getQuestion(id: number): Observable<Question> {
    return this.httpClient.get<Question>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions/${id}`);
  }

  public postQuestion(question: Question): Observable<Question> {
    return this.httpClient.post<Question>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions`, question);
  }

  public putQuestion(question: Question): Observable<Question> {
    return this.httpClient.put<Question>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions/${question.id}`, question);
  }

  public patchQuestion(question: Question): Observable<Question> {
    return this.httpClient.patch<Question>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions/${question.id}`, question);
  }

  public deleteQuestion(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/questions/${id}`);
  }  

}
