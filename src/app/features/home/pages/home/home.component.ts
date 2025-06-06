import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../../../../core/services/users.service';
import { LinksService } from '../../../../core/services/links.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Link } from '../../interfaces/link.interface';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { UserInterface } from '../../../auth/interfaces/user.interface';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { switchMap, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LinkFormComponent } from '../link-form/link-form.component';
import { NavBarComponent } from '../../../../core/components/nav-bar/nav-bar.component';
import { Filters } from '../../components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LinkFormComponent,
    NavBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public userService = inject(UsersService);
  private linksService = inject(LinksService);
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  links: Link[] = [];
  filteredLinks: Link[] = [];
  currentIndex = 0;
  searchVisible = false;
  searchTerm = '';
  viewMode: 'grid' | 'carousel' = 'carousel';
  showAddLinkForm = false;
  userMap: { [key: string]: UserInterface } = {};

  activeFilters: Filters = {
    niveau: [],
    langage: [],
    prix: [],
    type: []
  };

  navLinks = [
    { route: '/home', icon: 'home', label: 'Accueil' },
    { route: '/search', icon: 'search', label: 'Rechercher' },
    { route: '/profile', icon: 'person', label: 'Profil' },
    { route: '/settings', icon: 'settings', label: 'Paramètres' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLinks();
    }
  }

  // Méthode pour charger les liens
  // et les utilisateurs associés
  loadLinks() {
    this.linksService.getLinks().pipe(
      switchMap(links => {
        this.links = links;

        // Débogage pour voir les utilisateurs associés aux liens
        console.log('Tous les liens récupérés sur la page home:', links.length);
        console.log('IDs des créateurs de liens:', links.map(link => link.createdBy));

        // Vérifier l'utilisateur actuellement connecté
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          console.log('ID utilisateur actuel:', currentUser.uid);

          // Filtrer les liens de l'utilisateur actuel
          const userLinks = links.filter(link => link.createdBy === currentUser.uid);
          console.log('Liens de l\'utilisateur actuel sur la page home:', userLinks.length);
          console.log('Détails des liens:', userLinks);
        }

        this.applyFilters();
        const userIds = [...new Set(links.map(link => link.createdBy))];
        const userObservables = userIds.map(userId =>
          this.firestoreService.getDocument(`users/${userId}`)
        );
        return combineLatest(userObservables);
      })
    ).subscribe(users => {
      users.forEach(user => {
        if (user && user.id) {
          this.userMap[user.id] = user;
        }
      });
    });
  }

  // Méthode pour ouvrir un lien dans un nouvel onglet
  openLink(url: string): void {
    // Vérifier si l'URL commence par http:// ou https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Méthode pour appliquer les filtres sur les liens
  applyFilters() {
    // Filtre par terme de recherche
    let result = this.links.filter(link =>
      link.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Appliquer d'autres filtres si nécessaire
    if (this.hasActiveFilters()) {
      // Filtrer par niveau
      if (this.activeFilters.niveau.length > 0) {
        result = result.filter(link =>
          link.niveau && this.activeFilters.niveau.includes(link.niveau)
        );
      }

      // Filtrer par langage
      if (this.activeFilters.langage.length > 0) {
        result = result.filter(link =>
          link.tags && link.tags.some(tag =>
            this.activeFilters.langage.includes(tag)
          )
        );
      }

      // Filtrer par prix
      if (this.activeFilters.prix.length > 0) {
        result = result.filter(link => {
          const isPaid = link.isPaid;
          return (isPaid && this.activeFilters.prix.includes('Payant')) ||
            (!isPaid && this.activeFilters.prix.includes('Gratuit'));
        });
      }

      // Filtrer par type
      if (this.activeFilters.type.length > 0) {
        result = result.filter(link =>
          link.type && this.activeFilters.type.includes(link.type)
        );
      }
    }

    this.filteredLinks = result;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.activeFilters).some(filters => filters.length > 0);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredLinks.length;
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.filteredLinks.length) % this.filteredLinks.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  toggleSearch() {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) {
      this.searchTerm = '';
      this.applyFilters();
    }
  }

  onFilterChange(filters: Filters) {
    this.activeFilters = filters;
    this.applyFilters();
  }

  onViewModeChange(mode: 'grid' | 'carousel') {
    this.viewMode = mode;
  }

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'carousel' : 'grid';
  }

  toggleAddLinkForm() {
    this.showAddLinkForm = !this.showAddLinkForm;
  }

  onLinkAdded() {
    this.showAddLinkForm = false;
    this.loadLinks();
  }

  onSearchChange() {
    this.applyFilters();
  }

  getUserInfo(userId: string): UserInterface | null {
    return this.userMap[userId] || null;
  }

  logout(): void {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/login-choice']);
    });
  }
}
