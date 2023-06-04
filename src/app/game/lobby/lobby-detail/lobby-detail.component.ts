import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ConfirmDialog } from 'src/app/shared/dialog/confirm-dialog/confirm-dialog.component';
import { InputDialog } from 'src/app/shared/dialog/input-dialog/input-dialog.component';
import { LobbyDialog } from 'src/app/shared/dialog/lobby-dialog/lobby-dialog.component';
import { Player, User } from 'src/app/shared/model/Authenticator.model';
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

  players: Player[] = [];

  constructor(
    private vgameService: VGameService,
    private router: Router,
    private authenticatorService: AuthenticatorService,
    private matDialog: MatDialog
  ) { }

  ngOnDestroy(): void {
    clearInterval(this.lobbyFetch);

    this.vgameService.leaveLobby(this.lobbyId).pipe(first()).subscribe(
      res => { }
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
        this.patchLobby(res);

        if (!this.lobbyFetch)
          this.setIntervalCall();
      },
      error => {
        if (error.status === 400) {
          let dialog = this.matDialog.open(InputDialog, { data: { title: 'Enter lobby password', yes: "join", no: "back" } })

          dialog.afterClosed().pipe(first()).subscribe(
            res => {
              if (res) {
                this.vgameService.joinLobbyWithPassword(this.lobbyId, res).pipe(first()).subscribe(
                  res => {

                    if (!this.lobbyFetch)
                      this.setIntervalCall();

                    this.patchLobby(res);
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
        this.patchLobby(res);
      },
      error => {
        clearInterval(this.lobbyFetch);
        let dialog = this.matDialog.open(ConfirmDialog, { data: { title: 'Inactive notice!', message: 'Sorry you have been kick by host or being inactive', yes: 'ok', no: '' } })

        dialog.afterClosed().pipe(first()).subscribe(
          res => {
            this.router.navigate([this.lobbyRoute])
          }
        );
      }
    );
  }

  patchLobby(lobby: Lobby) {
    if (this.isNotSame(lobby, this.lobby)) {
      this.lobby = lobby;
      this.updatePlayerList();
      this.updateDisplayMessages();
    }
  }

  updateDisplayMessages(): void {
    let messages = structuredClone(this.lobby.messages)
    while (messages.length > this.maxMessageDisplay)
      messages = messages.slice(1, messages.length);

    if (this.isNotSame(messages, this.displayMessages))
      this.displayMessages = messages;
  }

  updatePlayerList(): void {
    let players: Player[] = [];
    this.lobby.lobbyInfo!.playerList?.forEach(e => {
      players.push(new Player(e));
    })

    if (this.isNotSame(players, this.players)) {
      this.players = players!;
    }
  }

  isNotSame(any1: any, any2: any): boolean {
    return JSON.stringify(any1) !== JSON.stringify(any2);
  }

  sendMessage() {
    if (this.message.trim()) {
      this.vgameService.sendMessage(this.lobbyId, this.message.trim()).pipe(first()).subscribe(
        res => {
          this.lobby = res;
        },
        error => { },
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
    let dialog = this.matDialog.open(LobbyDialog, { data: { lobbyId: this.lobbyId } });

    dialog.afterClosed().pipe(first()).subscribe(
      res => {
        this.updateLobby();
      }
    );
  }

  getTime(message: Message): string {
    return `${message.time.month}/${message.time.day}/${message.time.year} at ${message.time.hours}:${message.time.minute}:${message.time.second} EST`;
  }

  kickPlayer(playerId: number) {
    if(!this.isSelf(playerId)) {
      this.vgameService.kickPlayer(this.lobbyId, playerId).pipe(first()).subscribe(
        res => {
          this.patchLobby(res);
        }
      );
    }
  }

  isSelf(playerId: number): boolean {
    let userId = this.authenticatorService.currentUser!.id;
    return userId === playerId;
  }
}
