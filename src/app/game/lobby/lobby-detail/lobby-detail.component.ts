import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ConfirmDialog } from 'src/app/shared/dialog/confirm-dialog/confirm-dialog.component';
import { InputDialog } from 'src/app/shared/dialog/input-dialog/input-dialog.component';
import { LobbyDialog } from 'src/app/shared/dialog/lobby-dialog/lobby-dialog.component';
import { User } from 'src/app/shared/model/Authenticator.model';
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

  displayMessages: Message[] = [];

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
        if(this.isNotSame(res, this.lobby)) {
          this.lobby = res;
          this.updateDisplayMessages();
        }

        if(!this.lobbyFetch)
          this.setIntervalCall();
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
                      this.setIntervalCall();

                    if(this.isNotSame(res, this.lobby)) {
                      this.lobby = res;
                      this.updateDisplayMessages();
                    }
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

  setIntervalCall() {
    this.lobbyFetch = setInterval(() => {
      this.updateLobby();
    }, 1000); //1s
  }

  updateLobby() {
    this.vgameService.getLobby(this.lobbyId).pipe(first()).subscribe(
      res => {
        if(this.isNotSame(res, this.lobby)) {
          this.lobby = res;
          this.updateDisplayMessages();
        }
      },
      error => {
        clearInterval(this.lobbyFetch);
        let dialog = this.matDialog.open(ConfirmDialog, {data: {title: 'Inactive notice!', message: 'Sorry you have been auto kick for inactive', yes: 'ok', no: ''}})
      
        dialog.afterClosed().pipe(first()).subscribe(
          res => {
            this.router.navigate([this.lobbyRoute])
          }
        );
      }
    );
  }

  updateDisplayMessages(): void {
    let messages = structuredClone(this.lobby.messages)
    while(messages.length > this.maxMessageDisplay)
      messages = messages.slice(1, messages.length);

    if(JSON.stringify(messages) !== JSON.stringify(this.displayMessages))
      this.displayMessages = messages;
  }

  isNotSame(lobby1: Lobby, lobby2: Lobby): boolean {
    return JSON.stringify(lobby1) !== JSON.stringify(lobby2);
  }

  sendMessage() {
    if(this.message.trim()) {
      this.vgameService.sendMessage(this.lobbyId, this.message.trim()).pipe(first()).subscribe(
        res => {
          this.lobby = res;
        },
        error => {},
        () => {
          this.message = '';
          this.updateDisplayMessages();
        }
      );
    }
  }

  isHost(): boolean {
    let userId = this.authenticatorService.currentUser!.id;
    return this.getHost(this.lobby).id === userId;
  }

  getHost(lobby: Lobby): User {
    return lobby.lobbyInfo!.playerList![0];
  }

  changeRoomSetting() {
    let dialog = this.matDialog.open(LobbyDialog, {data: {lobbyId: this.lobbyId}});

    dialog.afterClosed().pipe(first()).subscribe(
      res => {
        this.updateLobby();
      }
    );
  }

  getTime(message: Message): string {
    return `${message.time.month}/${message.time.day}/${message.time.year} at ${message.time.hours}:${message.time.minute}:${message.time.second}`;
  }
}
