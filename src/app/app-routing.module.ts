import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { LobbyDetailComponent } from './game/lobby/lobby-detail/lobby-detail.component';
import { VincentComponent } from './about/vincent/vincent.component';
import { GeneralQuestionsComponent } from './trivia/general-questions/general-questions.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { CoolSymbolComponent } from './document/cool-symbol/cool-symbol.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [async () => !inject(AuthGuard).isLogin()],
  },
  {
    path: 'game',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'lobbies', 
        component: LobbyComponent,
      },
      {
        path: 'lobby',
        children: [
          {
            path: '**',
            component: LobbyDetailComponent
          }
        ]
      }
    ]
  },
  {
    path: 'trivia',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'questionnaire',
        component: GeneralQuestionsComponent
      }
    ]
  },
  {
    path: 'utils',
    children: [
      {
        path: 'ascii_symbol',
        component: CoolSymbolComponent
      }
    ]
  },
  {
    path: 'about',
    children: [
      {
        path: 'vincent',
        component: VincentComponent
      },
      {
        path: 'iframe',
        children: [
          {
            path: 'vincent',
            component: VincentComponent
          }
        ]
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
