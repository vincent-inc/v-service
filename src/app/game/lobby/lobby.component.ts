import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { LobbyDialog } from 'src/app/shared/dialog/lobby-dialog/lobby-dialog.component';
import { Lobby, LobbyRow } from 'src/app/shared/model/VGame.model';
import { VGameService } from 'src/app/shared/service/VGame.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {

  LobbyRows: LobbyRow[] = [];
  private lobbyFetch?: any;

  constructor(
    private vgameService: VGameService,
    private matDialog: MatDialog,
    private router: Router
  ) { }
  
  ngOnDestroy(): void {
    clearInterval(this.lobbyFetch);
  }

  ngOnInit() {
    this.init();

    this.lobbyFetch = setInterval(() => {
      this.init();
    }, 2000); //1s
  }

  init() {
    this.vgameService.getLobbies().pipe(first()).subscribe(
      res => {
        this.LobbyRows = [];
        res.forEach(lobby => {
          this.LobbyRows.push({
            id:                     lobby.id!,
            name:                   lobby.name!,
            description:            lobby.description!,
            game:                   lobby.currentGame!,
            player:                 lobby.currentNumberOfPlayer!,
            max_player:             lobby.maxPlayer!,
            password:               lobby.password ? true: false
          })
        })
      }
    );
  }

  createNewLobby() {
    let dialog = this.matDialog.open(LobbyDialog, {data: {lobbyId: 0}});

    dialog.afterClosed().pipe(first()).subscribe(
      res => {
        if(res) {
          
        }
        else
          this.init();
      }
    );
  }

  enterLobby(LobbyRow: LobbyRow) {
    this.router.navigate(['/game/lobby/', LobbyRow.id]);
  }

}
