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

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LinkFormComponent,
    StarRatingComponent,
    NotificationComponent
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
  currentIndex = 0;
  viewMode: 'grid' | 'carousel' = 'carousel';
  showAddLinkForm = false;
  userMap: { [key: string]: UserInterface } = {};
  currentBgImage: string | null = null;

  navLinks = [
    { route: '/home', icon: 'home', label: 'Accueil' },
    { route: '/search', icon: 'search', label: 'Rechercher' },
    { route: '/profile', icon: 'person', label: 'Profil' },
    { route: '/settings', icon: 'settings', label: 'Paramètres' },
  ];

  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
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
        this.links = links;

        // Configurer le swiper
        setTimeout(() => this.attachSwiperListener(), 0);
        setTimeout(() => this.startSwiperInterval(), 0);

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

  // Méthode pour ouvrir un lien dans un nouvel onglet
  openLink(url: string): void {
    // Vérifier si l'URL commence par http:// ou https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }



  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.links.length;
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.links.length) % this.links.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
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
    if (this.links[realIndex]) {
      this.currentBgImage = this.links[realIndex].imageUrl;
      this.currentIndex = realIndex;
      this.cdr.detectChanges();
    }
  }

  startSwiperInterval() {
    if (this.swiperInterval) {
      clearInterval(this.swiperInterval);
    }
    this.swiperInterval = setInterval(() => {
      if (this.swiperRef && this.swiperRef.nativeElement && this.links.length > 0) {
        const swiper = this.swiperRef.nativeElement.swiper;
        if (swiper) {
          const realIndex = swiper.realIndex ?? swiper.activeIndex;
          if (this.links[realIndex] && this.currentBgImage !== this.links[realIndex].imageUrl) {
            this.currentBgImage = this.links[realIndex].imageUrl;
            this.currentIndex = realIndex;
            this.cdr.detectChanges();
          }
        }
      }
    }, 300);
  }
}
