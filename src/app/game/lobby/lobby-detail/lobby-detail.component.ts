import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { LobbyDialog } from 'src/app/shared/dialog/lobby-dialog/lobby-dialog.component';
import { Lobby, Message } from 'src/app/shared/model/VGame.model';
import { AuthenticatorService } from 'src/app/shared/service/Authenticator.service';
import { VGameService } from 'src/app/shared/service/VGame.service';

@Component({
  selector: 'app-lobby-detail',
  templateUrl: './lobby-detail.component.html',
  styleUrls: ['./lobby-detail.component.scss']
})
export class LobbyDetailComponent implements OnInit, OnDestroy {

  lobbyId!: string;
  lobby!: Lobby;
  message: string = '';

  maxMessageDisplay: number = 10;

  displayChat: boolean = true;

  private lobbyFetch?: any;

  constructor(
    private vgameService: VGameService,
    private router: Router,
    private authenticatorService: AuthenticatorService,
    private matDialog: MatDialog
  ) { }

  ngOnDestroy(): void {
    clearInterval(this.lobbyFetch);

    this.vgameService.leaveLobby(this.lobbyId).pipe(first()).subscribe(
      res => {}
    );
  }

  ngOnInit() {
    let urls = this.router.url.split('/');
    this.lobbyId = urls[urls.length - 1];
    this.lobbyFetch = setInterval(() => {
      this.updateLobby();
    }, 1000); //1s
    
    this.init();
  }

  updateLobby() {
    this.vgameService.getLobby(this.lobbyId).pipe(first()).subscribe(
      res => {
        if(this.isNotSame(res, this.lobby))
          this.lobby = res;
      }
    );
  }

  init() {
    this.vgameService.joinLobby(this.lobbyId).pipe(first()).subscribe(
      res => {
        if(this.isNotSame(res, this.lobby))
          this.lobby = res;
      }
    );
  }

  isNotSame(lobby1: Lobby, lobby2: Lobby): boolean {
    return JSON.stringify(lobby1) !== JSON.stringify(lobby2);
  }

  sendMessage() {
    this.vgameService.sendMessage(this.lobbyId, this.message).pipe(first()).subscribe(
      res => {
        this.lobby = res;
      },
      error => {},
      () => {this.message = ''}
    );
  }

  isHost(): boolean {
    let userId = this.authenticatorService.currentUser!.id;
    return this.lobby.lobbyInfo!.host!.id === userId;
  }

  changeRoomSetting() {
    let dialog = this.matDialog.open(LobbyDialog, {data: {lobbyId: this.lobbyId}});

    dialog.afterClosed().pipe(first()).subscribe(
      res => {
        this.updateLobby();
      }
    );
  }

  getMessages(): Message[] {
    let messages = structuredClone(this.lobby.messages)
    while(messages.length > this.maxMessageDisplay)
      messages = messages.slice(1, messages.length);

    return messages;
  }

  getTime(message: Message): string {
    return `${message.time.month}/${message.time.day}/${message.time.year} at ${message.time.hours}:${message.time.minute}:${message.time.second}`;
  }
}
