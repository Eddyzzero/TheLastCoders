import { Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit, PLATFORM_ID, Inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { NotificationComponent } from '../../../../core/components/notification/notification.component';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';
import { Filters } from '../../interfaces/filter.interface';
import { ViewModeService, ViewMode } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LinkFormComponent,
    StarRatingComponent,
    NotificationComponent,
    FilterPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public userService = inject(UsersService);

  // Notification properties
  showNotification = false;
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'success';
  notificationMessage = '';
  private linksService = inject(LinksService);
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  links: Link[] = [];
  filteredLinks: Link[] = [];
  currentIndex = 0;
  private viewModeService = inject(ViewModeService);
  public viewMode$ = this.viewModeService.viewMode$;
  showAddLinkForm = false;
  userMap: { [key: string]: UserInterface } = {};
  currentBgImage: string | null = null;
  activeFilters: Filters | null = null;

  navLinks = [
    { route: '/home', icon: 'home', label: 'Accueil' },
    { route: '/search', icon: 'search', label: 'Rechercher' },
    { route: '/profile', icon: 'person', label: 'Profil' },
    { route: '/settings', icon: 'settings', label: 'Paramètres' },
  ];

  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  @ViewChild('filterPanel') filterPanel!: FilterPanelComponent;
  private swiperInterval: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Initialisation des liens si on est dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.loadLinks();
    }
  }

  // ici on attache le swiper listener et on démarre l'intervalle
  // on démarre l'intervalle pour que le fond dynamique soit mis à jour toutes les 300ms

  ngAfterViewInit() {
    this.attachSwiperListener();
    this.startSwiperInterval();
  }

  ngOnDestroy() {
    if (this.swiperInterval) {
      clearInterval(this.swiperInterval);
    }
    if (this.swiperRef && this.swiperRef.nativeElement) {
      this.swiperRef.nativeElement.removeEventListener('slidechange', this.swiperSlideChangeHandler);
    }
  }

  // Méthode pour charger les liens
  // et les utilisateurs associés
  loadLinks() {
    this.linksService.getLinks().pipe(
      switchMap(links => {
        console.log('Liens chargés depuis Firestore:', links);

        // Convertir les timestamps Firestore en objets Date JavaScript
        const convertedLinks = links.map(link => ({
          ...link,
          createdAt: this.convertFirestoreTimestamp(link.createdAt)
        }));

        this.links = convertedLinks;
        this.filteredLinks = [...convertedLinks]; // Initialiser filteredLinks avec tous les liens

        // Si des filtres sont actifs, réappliquer les filtres
        if (this.activeFilters) {
          this.applyFilters(this.activeFilters);
        }

        // Configurer le swiper
        setTimeout(() => {
          this.attachSwiperListener();
          this.startSwiperInterval();
          // Mettre à jour l'image de fond
          if (this.filteredLinks.length > 0) {
            this.currentBgImage = this.filteredLinks[this.currentIndex].imageUrl;
            this.cdr.detectChanges();
          }
        }, 0);

        // Charger les informations des utilisateurs
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

  // Méthode pour convertir les timestamps Firestore en objets Date JavaScript
  private convertFirestoreTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date();

    // Si c'est déjà un objet Date, le retourner tel quel
    if (timestamp instanceof Date) return timestamp;

    // Si c'est un timestamp Firestore avec seconds et nanoseconds
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000);
    }

    // Si c'est un timestamp Unix en millisecondes
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }

    // Si c'est une chaîne de caractères, essayer de la parser
    if (typeof timestamp === 'string') {
      const parsed = new Date(timestamp);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Fallback: retourner la date actuelle
    console.warn('Impossible de convertir le timestamp:', timestamp);
    return new Date();
  }

  // Méthode pour appliquer les filtres
  applyFilters(filters: Filters): void {
    console.log('Filtres reçus:', filters);
    console.log('Liens avant filtrage:', this.links);

    this.activeFilters = filters;

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = filters.niveau.length > 0 || filters.langage.length > 0 ||
      filters.prix.length > 0 || filters.type.length > 0;

    console.log('Filtres actifs:', hasActiveFilters);

    if (!hasActiveFilters) {
      // Si aucun filtre n'est sélectionné, afficher tous les liens
      this.filteredLinks = [...this.links];
      console.log('Aucun filtre actif, affichage de tous les liens');
    } else {
      // Filtrer les liens selon les critères sélectionnés
      this.filteredLinks = this.links.filter(link => {
        console.log('Filtrage du lien:', link.title, 'Propriétés:', {
          niveau: link.niveau,
          type: link.type,
          tags: link.tags,
          isPaid: link.isPaid
        });

        // Filtre par niveau
        if (filters.niveau.length > 0) {
          const linkNiveau = link.niveau || '';
          if (!filters.niveau.includes(linkNiveau)) {
            console.log('Lien rejeté par niveau:', link.title, 'niveau:', linkNiveau, 'filtres:', filters.niveau);
            return false;
          }
        }

        // Filtre par langage (vérifier si les tags contiennent au moins un langage sélectionné)
        if (filters.langage.length > 0) {
          const linkTags = link.tags || [];
          const hasMatchingLangage = filters.langage.some(lang =>
            linkTags.some(tag => tag && tag.toLowerCase().includes(lang.toLowerCase()))
          );
          if (!hasMatchingLangage) {
            console.log('Lien rejeté par langage:', link.title, 'tags:', linkTags, 'filtres:', filters.langage);
            return false;
          }
        }

        // Filtre par prix
        if (filters.prix.length > 0) {
          const linkIsPaid = link.isPaid || false;
          const isPaidSelected = filters.prix.includes('Payant');
          const isFreeSelected = filters.prix.includes('Gratuit');

          if (isPaidSelected && !linkIsPaid) {
            console.log('Lien rejeté par prix (payant):', link.title, 'isPaid:', linkIsPaid);
            return false;
          }
          if (isFreeSelected && linkIsPaid) {
            console.log('Lien rejeté par prix (gratuit):', link.title, 'isPaid:', linkIsPaid);
            return false;
          }
        }

        // Filtre par type
        if (filters.type.length > 0) {
          const linkType = link.type || '';
          if (!filters.type.includes(linkType)) {
            console.log('Lien rejeté par type:', link.title, 'type:', linkType, 'filtres:', filters.type);
            return false;
          }
        }

        console.log('Lien accepté:', link.title);
        return true;
      });
    }

    console.log('Liens après filtrage:', this.filteredLinks);
    console.log('Nombre de liens filtrés:', this.filteredLinks.length);

    // Réinitialiser l'index courant si nécessaire
    if (this.currentIndex >= this.filteredLinks.length) {
      this.currentIndex = 0;
    }

    // Mettre à jour l'image de fond si on a des liens filtrés
    if (this.filteredLinks.length > 0) {
      this.currentBgImage = this.filteredLinks[this.currentIndex].imageUrl;
    } else {
      this.currentBgImage = null;
    }

    this.cdr.detectChanges();
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
    this.activeFilters = null;
    this.filteredLinks = [...this.links];
    this.currentIndex = 0;
    if (this.filteredLinks.length > 0) {
      this.currentBgImage = this.filteredLinks[0].imageUrl;
    }
    this.cdr.detectChanges();
  }

  // Méthode pour ouvrir un lien dans un nouvel onglet
  openLink(url: string): void {
    // Vérifier si l'URL commence par http:// ou https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }



  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredLinks.length;
    this.currentBgImage = this.filteredLinks[this.currentIndex].imageUrl;
    this.cdr.detectChanges();
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.filteredLinks.length) % this.filteredLinks.length;
    this.currentBgImage = this.filteredLinks[this.currentIndex].imageUrl;
    this.cdr.detectChanges();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  toggleAddLinkForm() {
    this.showAddLinkForm = !this.showAddLinkForm;
  }

  onLinkAdded() {
    this.showAddLinkForm = false;
    this.loadLinks();

    // Show success notification
    this.showNotification = true;
    this.notificationType = 'success';
    this.notificationMessage = 'Le lien a été ajouté avec succès!';

    // Hide notification after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  getUserInfo(userId: string): UserInterface | null {
    return this.userMap[userId] || null;
  }

  logout(): void {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/login-choice']);
    });
  }

  async onRatingChange(link: Link, rating: number) {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    await this.linksService.rateLink(link.id!, user.uid, rating);
  }

  async getUserRating(link: Link): Promise<number> {
    const user = await this.authService.getCurrentUser();
    if (!user) return 0;
    return this.linksService.getUserRating(link, user.uid);
  }

  attachSwiperListener() {
    if (this.swiperRef && this.swiperRef.nativeElement) {
      this.swiperRef.nativeElement.removeEventListener('slidechange', this.swiperSlideChangeHandler);
      this.swiperRef.nativeElement.addEventListener('slidechange', this.swiperSlideChangeHandler);
    }
  }

  swiperSlideChangeHandler = (event: any) => {
    const swiper = event.target.swiper;
    const realIndex = swiper.realIndex ?? swiper.activeIndex;
    if (this.filteredLinks[realIndex]) {
      this.currentBgImage = this.filteredLinks[realIndex].imageUrl;
      this.currentIndex = realIndex;
      this.cdr.detectChanges();
    }
  }

  startSwiperInterval() {
    if (this.swiperInterval) {
      clearInterval(this.swiperInterval);
    }
    this.swiperInterval = setInterval(() => {
      if (this.swiperRef && this.swiperRef.nativeElement && this.filteredLinks.length > 0) {
        const swiper = this.swiperRef.nativeElement.swiper;
        if (swiper) {
          const realIndex = swiper.realIndex ?? swiper.activeIndex;
          if (this.filteredLinks[realIndex] && this.currentBgImage !== this.filteredLinks[realIndex].imageUrl) {
            this.currentBgImage = this.filteredLinks[realIndex].imageUrl;
            this.currentIndex = realIndex;
            this.cdr.detectChanges();
          }
        }
      }
    }, 300);
  }
}
