import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { NavBarComponent } from './core/components/nav-bar/nav-bar.component';
import { AuthService } from './core/services/fireAuth.service';
import { InitialNavigationService } from './core/services/initial-navigation.service';

/**
 * Composant racine de l'application TheLastCoders
 * 
 * Ce composant gère :
 * - L'initialisation de la navigation basée sur l'authentification
 * - L'affichage de la barre de navigation
 * - Le routage principal de l'application
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBarComponent,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // Services injectés
  protected authService = inject(AuthService);
  private initialNavigationService = inject(InitialNavigationService);

  // Propriétés du composant
  readonly title = 'TheLastCoders';

  /**
   * Initialise l'application au démarrage
   * Configure la navigation initiale selon l'état d'authentification
   */
  ngOnInit(): void {
    this.initialNavigationService.initializeNavigation();
  }
}
