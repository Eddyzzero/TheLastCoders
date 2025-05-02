import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { SkillsQuizComponent } from './features/auth/pages/skills-quiz/skills-quiz.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LinkFormComponent } from './features/home/pages/link-form/link-form.component';
import { LinkDetailComponent } from './features/home/pages/link-detail/link-detail.component';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login-choice',
        pathMatch: 'full'
    },
    { path: 'login-choice', component: LoginChoiceComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'skills', component: SkillsQuizComponent },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'home/add',
        component: LinkFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'home/:id',
        component: LinkDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'link/:id',
        component: LinkDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login-choice'
    }
];
