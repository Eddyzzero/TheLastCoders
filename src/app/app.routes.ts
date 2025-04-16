import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { SkillsQuizComponent } from './features/auth/pages/skills-quiz/skills-quiz.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LinkFormComponent } from './features/home/pages/link-form/link-form.component';
import { LinkDetailComponent } from './features/home/pages/link-detail/link-detail.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout.component';
import { HomeLayoutComponent } from './features/home/layouts/home-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login-choice',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login-choice', component: LoginChoiceComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'skills', component: SkillsQuizComponent },
            { path: '', redirectTo: 'login-choice', pathMatch: 'full' }
        ]
    },
    {
        path: 'home',
        component: HomeLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'add', component: LinkFormComponent },
            { path: ':id', component: LinkDetailComponent }
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login-choice'
    }
];
