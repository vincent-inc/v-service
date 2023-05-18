import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { InputDialog } from 'src/app/shared/dialog/input-dialog/input-dialog.component';
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

  lobbyRoute = '/game/lobbies'

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
    this.init();
  }

  init() {
    this.vgameService.joinLobby(this.lobbyId).pipe(first()).subscribe(
      res => {
        if(this.isNotSame(res, this.lobby))
          this.lobby = res;

        if(!this.lobbyFetch)
          this.lobbyFetch = setInterval(() => {
            this.updateLobby();
          }, 1000); //1s
      },
      error => {
        if(error.status === 400) {
          let dialog = this.matDialog.open(InputDialog, {data: {title: 'Enter lobby password', yes: "join", no: "back"}})

          dialog.afterClosed().pipe(first()).subscribe(
            res => {
              if(res) {
                this.vgameService.joinLobbyWithPassword(this.lobbyId, res).pipe(first()).subscribe(
                  res => {

                    if(!this.lobbyFetch)
                      this.lobbyFetch = setInterval(() => {
                        this.updateLobby();
                      }, 1000); //1s

                    if(this.isNotSame(res, this.lobby))
                      this.lobby = res;
                  },
                  error => {
                    this.router.navigate([this.lobbyRoute]);
                  }
                );
              }
              else
                this.router.navigate([this.lobbyRoute]);
            }
          );
        }
      }
    );
  }

  updateLobby() {
    this.vgameService.getLobby(this.lobbyId).pipe(first()).subscribe(
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
