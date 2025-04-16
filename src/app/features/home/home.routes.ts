import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LinkFormComponent } from './pages/link-form/link-form.component';
import { LinkDetailComponent } from './pages/link-detail/link-detail.component';

export const HOME_ROUTES: Route[] = [
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