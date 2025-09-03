import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'user-profile/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'link/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
