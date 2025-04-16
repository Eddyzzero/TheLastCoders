import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/fireAuth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBarComponent,
    AsyncPipe
  ],
  template: `
    <section [class]="(authService.isLoggedIn$ | async) ? 'min-h-screen bg-black' : 'min-h-screen color-back'">
      <router-outlet></router-outlet>
      <app-nav-bar *ngIf="authService.isLoggedIn$ | async"></app-nav-bar>
    </section>
  `
})
export class AppComponent {
  protected authService = inject(AuthService);
  title = 'TheLastCoders';
}
