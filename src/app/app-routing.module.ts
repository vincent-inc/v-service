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
import { CoolSymbolComponent } from './cool_util/cool-symbol/cool-symbol.component';
import { UserSettingComponent } from './setting/user-setting/user-setting.component';
import { SpringBootSnippetV01Component } from './cool_util/Spring-boot-snippet-v01/Spring-boot-snippet-v01.component';
import { AngularServiceGeneratorComponent } from './cool_util/angular-service-generator/angular-service-generator.component';
import { AiReaderBodyComponent } from './ai_reader/ai-reader-body/ai-reader-body.component';

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
    // canActivate: [async () => !inject(AuthGuard).isLogin()],
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
    path: 'ai',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'reader',
        component: AiReaderBodyComponent
      }
    ]
  },
  {
    path: 'setting',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'user',
        component: UserSettingComponent
      }
    ]
  },
  {
    path: 'utils',
    children: [
      {
        path: 'ascii_symbol',
        component: CoolSymbolComponent
      },
      {
        path: 'spring_boot_snippet_v01',
        component: SpringBootSnippetV01Component
      },
      {
        path: 'angular_service_generator',
        component: AngularServiceGeneratorComponent
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
  },

  // default path
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
