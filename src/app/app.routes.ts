import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authRedirectGuard } from './core/guards/auth-redirect.guard';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { SkillsQuizComponent } from './features/auth/pages/skills-quiz/skills-quiz.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LinkFormComponent } from './features/home/pages/link-form/link-form.component';
import { LinkDetailComponent } from './features/home/pages/link-detail/link-detail.component';
import { UsersComponent } from './features/users/users.component';
import { UserManagementComponent } from './features/admin/pages/user-management/user-management.component';
import { inject } from '@angular/core';
import { AuthService } from './core/services/fireAuth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PolicyComponent } from './features/legal/policy/policy.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login-choice',
        pathMatch: 'full'
    },
    {
        path: 'login-choice',
        component: LoginChoiceComponent,
        canActivate: [authRedirectGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [authRedirectGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authRedirectGuard]
    },
    {
        path: 'skills',
        component: SkillsQuizComponent,
        canActivate: [authGuard]
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'user-profile/:id',
        component: UsersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/users',
        component: UserManagementComponent,
        canActivate: [authGuard]
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
        path: 'policy',
        component: PolicyComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login-choice'
    }
];
