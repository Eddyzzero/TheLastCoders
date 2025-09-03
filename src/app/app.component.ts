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
  templateUrl: './app.component.html'
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
