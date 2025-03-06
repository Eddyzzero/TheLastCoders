import { Routes } from '@angular/router';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { SkillsQuizComponent } from './features/home/components/skills-quiz/skills-quiz.component';


export const routes: Routes = [
    { path: 'loginChoice', component: LoginChoiceComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'skills', component: SkillsQuizComponent },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'loginChoice', pathMatch: 'full' },
    { path: '', redirectTo: 'loginChoice', pathMatch: 'full' }
];
