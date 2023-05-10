import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs';
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
    private vgameService: VGameService
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
            id:                    lobby.id!,
            name:                  lobby.name!,
            description:           lobby.description!,
            currentGame:           lobby.currentGame!,
            password:              lobby.password!,
            currentNumberOfPlayer: lobby.currentNumberOfPlayer!,
            maxPlayer:             lobby.maxPlayer!,
          })
        })
      }
    );
  }

  createNewLobby() {

  }

}
