import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';

const routes: Routes = [
    {
        path: 'users',
        component: UserManagementComponent
    },
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), UserManagementComponent]
})
export class AdminModule { }
