import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticatorService } from '../../service/Authenticator.service';
import { VGameService } from '../../service/VGame.service';
import { Lobby } from '../../model/VGame.model';
import { User } from '../../model/Authenticator.model';
import { first } from 'rxjs';

@Component({
  selector: 'app-lobby-dialog',
  templateUrl: './lobby-dialog.component.html',
  styleUrls: ['./lobby-dialog.component.scss']
})
export class LobbyDialog implements OnInit, AfterViewChecked {

  Lobby!: Lobby;
  lobbyCopy!: Lobby;
  user!: User;

  validForm: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {lobbyId: string},
    private dialogRef: MatDialogRef<LobbyDialog>,
    private authenticatorService: AuthenticatorService,
    private vgameService: VGameService,
    private cd: ChangeDetectorRef
  ) { }
  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.authenticatorService.getCurrentLoginUser().pipe(first()).subscribe(
      res => {
        this.user = res;
      }
    );
    
    if(this.data.lobbyId) {
      this.vgameService.getLobby(this.data.lobbyId).pipe(first()).subscribe(
        res => {
          this.Lobby = res;
        }
      );
    }
    else {
      this.Lobby = {
        id: '',
        name:                  'string',
        description:           'string',
        currentGame:           'string',
        password:              'string',
        currentNumberOfPlayer: 1,
        maxPlayer:             2,
        lobbyGame:             {
          host:           this.user,
          playerList:     [],
          spectatingList: [this.user],
          conversation:   [],
        },
        battleshipGame:        {
          maxPlayer:             2,
          currentNumberOfPlayer: 0,
          gridSize:              7,
          maxNumberOfShip:       5
        },
      }
    }
  }

  save() {
    if(this.data.lobbyId) {
      
    }
    else {
      this.vgameService.postLobby(this.Lobby).pipe(first()).subscribe(
        res => {
          this.dialogRef.close('save');
        }
      );
    }
  }

  revert() {
    this.Lobby = structuredClone(this.lobbyCopy);
  }

  isValueNotChange(): boolean {
    return JSON.stringify(this.Lobby) === JSON.stringify(this.lobbyCopy);
  }

}
