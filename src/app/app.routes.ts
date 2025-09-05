import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authRedirectGuard } from './core/guards/auth-redirect.guard';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

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
        loadComponent: () => import('./features/auth/pages/skills-quiz/skills-quiz.component').then(m => m.SkillsQuizComponent),
        canActivate: [authGuard]
    },
    {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
    },
    {
        path: 'user-profile/:id',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authGuard]
    },
    {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        canActivate: [authGuard]
    },
    {
        path: 'policy',
        loadComponent: () => import('./features/policy/policy.component').then(m => m.PolicyComponent),
        canActivate: [authGuard]
    },
    {
        path: 'link/:id',
        loadComponent: () => import('./features/home/pages/link-detail/link-detail.component').then(m => m.LinkDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login-choice'
    }
];
