import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Lobby } from 'src/app/shared/model/VGame.model';
import { VGameService } from 'src/app/shared/service/VGame.service';

@Component({
  selector: 'app-lobby-detail',
  templateUrl: './lobby-detail.component.html',
  styleUrls: ['./lobby-detail.component.scss']
})
export class LobbyDetailComponent implements OnInit, OnDestroy {

  lobbyId!: string;
  lobby!: Lobby;

  private lobbyFetch?: any;

  constructor(
    private vgameService: VGameService,
    private router: Router
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
      this.vgameService.getLobby(this.lobbyId).pipe(first()).subscribe(
        res => this.lobby = res
      );
    }, 1000); //1s
    this.init();
  }

  init() {
    this.vgameService.joinLobby(this.lobbyId).pipe(first()).subscribe(
      res => {
        this.lobby = res;
      }
    );
  }

}
