import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LinkFormComponent } from './pages/link-form/link-form.component';
import { LinkDetailComponent } from './pages/link-detail/link-detail.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'add',
        component: LinkFormComponent
    },
    {
        path: ':id',
        component: LinkDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), HomeComponent, LinkFormComponent, LinkDetailComponent]
})
export class HomeModule { }
