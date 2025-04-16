import { Route } from '@angular/router';
import { LoginChoiceComponent } from './pages/login-choice/login-choice.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SkillsQuizComponent } from './pages/skills-quiz/skills-quiz.component';

export const AUTH_ROUTES: Route[] = [
    {
        path: 'login-choice',
        component: LoginChoiceComponent
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
        path: 'skills',
        component: SkillsQuizComponent
    },
    {
        path: '',
        redirectTo: 'login-choice',
        pathMatch: 'full'
    }
]; 