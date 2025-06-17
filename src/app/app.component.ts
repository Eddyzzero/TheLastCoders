import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/fireAuth.service';
import { AsyncPipe } from '@angular/common';
import { InitialNavigationService } from './core/services/initial-navigation.service';

@Component({
  selector: 'app-root',
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
export class AppComponent implements OnInit {
  protected authService = inject(AuthService);
  private initialNavigationService = inject(InitialNavigationService);
  title = 'TheLastCoders';

  ngOnInit(): void {
    // Initialiser la navigation en fonction de l'état d'authentification
    this.initialNavigationService.initializeNavigation();
  }
}
