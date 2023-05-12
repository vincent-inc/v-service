import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { GirlfriendTestComponent } from './trivia/girlfriend-test/girlfriend-test.component';
import { LobbyDetailComponent } from './game/lobby/lobby-detail/lobby-detail.component';
import { VincentComponent } from './about/vincent/vincent.component';

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
    component: RegisterComponent
  },
  {
    path: 'game',
    children: [
      {
        path: 'lobbies',
        component: LobbyComponent
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
    children: [
      {
        path: 'girlfriend_test',
        component: GirlfriendTestComponent
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
