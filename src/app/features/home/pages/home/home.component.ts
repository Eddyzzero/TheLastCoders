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
import { Observable, map, switchMap, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LinkFormComponent } from '../link-form/link-form.component';
import { NavBarComponent } from '../../../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
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

  loadLinks() {
    this.linksService.getLinks().pipe(
      switchMap(links => {
        this.links = links;
        this.filterLinks();
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

  filterLinks() {
    this.filteredLinks = this.links.filter(link =>
      link.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
      this.filterLinks();
    }
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
    this.filterLinks();
  }

  getUserInfo(userId: string): UserInterface | null {
    return this.userMap[userId] || null;
  }

  logout(): void {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
