import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgEssentialModule } from './shared/module/ng-essential.module';
import { NgMaterialModule } from './shared/module/ng-material.module';
import { NgComponentModule } from './shared/module/ng-component.module';
import { NgDialogModule } from './shared/module/ng-dialog.module ';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/guards/auth.interceptor';
import { BattleshipComponent } from './game/battleship/battleship.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { GirlfriendTestComponent } from './trivia/girlfriend-test/girlfriend-test.component';
import { LobbyDetailComponent } from './game/lobby/lobby-detail/lobby-detail.component';
import { VincentComponent } from './about/vincent/vincent.component';

@NgModule({
  declarations: [			
    AppComponent,
      LoginComponent,
      HeaderComponent,
      SideDrawerComponent,
      HomeComponent,
      RegisterComponent,
      BattleshipComponent,
      LobbyComponent,
      GirlfriendTestComponent,
      LobbyDetailComponent,
      VincentComponent
   ],
  imports: [
    NgEssentialModule,
    NgMaterialModule,
    NgComponentModule,
    NgDialogModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
