import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { LoginChoiceComponent } from './features/auth/pages/login-choice/login-choice.component';

export const routes: Routes = [
    { path: 'loginChoice', component: LoginChoiceComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'loginChoice', pathMatch: 'full' }
];
