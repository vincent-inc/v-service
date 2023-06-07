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
import { LobbyDetailComponent } from './game/lobby/lobby-detail/lobby-detail.component';
import { VincentComponent } from './about/vincent/vincent.component';
import { GeneralQuestionsComponent } from './trivia/general-questions/general-questions.component';
import { CoolSymbolComponent } from './cool_util/cool-symbol/cool-symbol.component';
import { UserSettingComponent } from './setting/user-setting/user-setting.component';
import { SpringBootSnippetV01Component } from './cool_util/Spring-boot-snippet-v01/Spring-boot-snippet-v01.component';
import { AngularServiceGeneratorComponent } from './cool_util/angular-service-generator/angular-service-generator.component';

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
      LobbyDetailComponent,
      VincentComponent,
      GeneralQuestionsComponent,
      CoolSymbolComponent,
      UserSettingComponent,
      SpringBootSnippetV01Component,
      AngularServiceGeneratorComponent
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
