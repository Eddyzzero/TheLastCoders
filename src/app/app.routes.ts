import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authRedirectGuard } from './core/guards/auth-redirect.guard';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

/**
 * Configuration des routes principales de l'application TheLastCoders
 * 
 * Structure des routes :
 * - Routes publiques : login-choice, login, register
 * - Routes protégées : home, admin, skills, policy, link-detail
 * - Routes publiques spéciales : users (liste des utilisateurs)
 * - Lazy loading : modules home et admin pour optimiser les performances
 */
export const routes: Routes = [
    // Route par défaut - redirection vers le choix de connexion
    {
        path: '',
        redirectTo: 'login-choice',
        pathMatch: 'full'
    },

    // === ROUTES D'AUTHENTIFICATION (Publiques) ===
    {
        path: 'login-choice',
        component: LoginChoiceComponent,
        canActivate: [authRedirectGuard], // Redirige si déjà connecté
        title: 'Choix de connexion - TheLastCoders'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [authRedirectGuard], // Redirige si déjà connecté
        title: 'Connexion - TheLastCoders'
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authRedirectGuard], // Redirige si déjà connecté
        title: 'Inscription - TheLastCoders'
    },

    // === ROUTES PROTÉGÉES (Nécessitent une authentification) ===
    {
        path: 'skills',
        loadComponent: () => import('./features/auth/pages/skills-quiz/skills-quiz.component').then(m => m.SkillsQuizComponent),
        canActivate: [authGuard],
        title: 'Quiz de compétences - TheLastCoders'
    },
    {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        canActivate: [authGuard],
        title: 'Accueil - TheLastCoders'
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authGuard],
        title: 'Administration - TheLastCoders'
    },
    {
        path: 'policy',
        loadComponent: () => import('./features/policy/policy.component').then(m => m.PolicyComponent),
        canActivate: [authGuard],
        title: 'Politique de confidentialité - TheLastCoders'
    },
    {
        path: 'link/:id',
        loadComponent: () => import('./features/home/pages/link-detail/link-detail.component').then(m => m.LinkDetailComponent),
        canActivate: [authGuard],
        title: 'Détail du lien - TheLastCoders'
    },

    // === ROUTES PUBLIQUES SPÉCIALES ===
    {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        title: 'Utilisateurs - TheLastCoders'
    },
    {
        path: 'user-profile/:id',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard],
        title: 'Profil utilisateur - TheLastCoders'
    },

    // === ROUTE DE FALLBACK ===
    {
        path: '**',
        redirectTo: 'login-choice'
    }
];
