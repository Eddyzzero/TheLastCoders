import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserInterface } from '../auth/interfaces/user.interface';
import { AuthService } from '../../core/services/fireAuth.service';
import { UsersService } from '../../core/services/users.service';
import { LinksService } from '../../core/services/links.service';
import { Link } from '../../features/home/interfaces/link.interface';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { FirestorageService } from '../../core/services/firestorage.service';
import { effect } from '@angular/core';
import { NotificationComponent } from '../../core/components/notification/notification.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NotificationComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {
  // Injection des services
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private linksService = inject(LinksService);
  private firestorageService = inject(FirestorageService);
  private fb = inject(FormBuilder);

  // Propriétés de classe
  user: UserInterface | null = null;
  profileForm: FormGroup;

  // Notification properties
  showNotification = false;
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'success';
  notificationMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditing = false;
  userSharedLinks: Link[] = [];
  likedLinks: Link[] = [];
  userId: string = '';
  isLoading: boolean = true;
  private subscriptions: Subscription[] = [];
  canEdit: boolean = false;
  currentUser: UserInterface | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      userName: [''],
      userImageUrl: [''],
      bio: [''],
      github: [''],
      linkedin: [''],
      twitter: ['']
    });

    effect(() => {
      const user = this.authService.currentUserSignal();
      if (user) {
        this.usersService.getUserById(user.id || '').subscribe(fullUser => {
          this.currentUser = fullUser;
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnInit() {
    // Si un paramètre d'URL existe, afficher ce profil
    const routeUserId = this.route.snapshot.paramMap.get('id');

    // Vérifier si l'utilisateur est connecté (gardé côté client en plus du guard)
    const currentUser = this.authService.currentUserSignal();
    const firebaseUser = this.authService.getCurrentUser();

    if (!currentUser && !firebaseUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (routeUserId) {
      // Priorité à l'ID passé dans l'URL (consultation d'un autre profil)
      this.userId = routeUserId;
    } else if (firebaseUser && firebaseUser.uid) {
      // Sinon, afficher le profil de l'utilisateur courant (UID Firebase)
      this.userId = firebaseUser.uid;
    } else if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
    }

    if (this.userId) {
      // Afficher tous les liens pour déboguer
      this.linksService.getLinks().subscribe(allLinks => {
        const createdByValues = [...new Set(allLinks.map(link => link.createdBy))];
        // console.log('Tous les liens disponibles:', allLinks.length);
        // console.log('Valeurs uniques de createdBy:', createdByValues);
        // console.log('Notre userId actuel:', this.userId);
        // console.log('Est-ce que notre userId existe dans les liens?', createdByValues.includes(this.userId));

        // Afficher les liens de cet utilisateur pour vérification
        const userLinks = allLinks.filter(link => link.createdBy === this.userId);
        // console.log(`Liens avec userId=${this.userId}:`, userLinks);
      });

      this.loadUserData();
      this.loadUserSharedLinks();
      this.checkEditPermission();
    } else {
      // console.error('ID utilisateur non valide');
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    // Nettoyer les souscriptions pour éviter les fuites de mémoire
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData() {
    this.usersService.getUserById(this.userId).subscribe({
      next: (userDoc) => {
        this.user = userDoc;
        if (this.user) {
          this.initForm();
        }
      },
      error: (error) => {
        // console.error('Error fetching user:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  private initForm() {
    this.profileForm.patchValue({
      userName: this.user?.userName || '',
      bio: this.user?.bio || '',
      github: this.user?.socialLinks?.github || '',
      linkedin: this.user?.socialLinks?.linkedin || '',
      twitter: this.user?.socialLinks?.twitter || ''
    });
  }

  // Vérifier si l'utilisateur peut modifier ce profil
  checkEditPermission(): void {
    this.usersService.canModifyUser(this.userId).subscribe({
      next: (canModify) => {
        this.canEdit = canModify;
        // console.log(`Droits de modification pour ce profil: ${canModify ? 'Oui' : 'Non'}`);
      },
      error: (error) => {
        // console.error('Erreur lors de la vérification des permissions:', error);
        this.canEdit = false;
      }
    });
  }

  toggleEdit(): void {
    // Vérifier d'abord si l'utilisateur a le droit de modifier ce profil
    if (!this.canEdit) {
      // console.error('Vous n\'avez pas les droits nécessaires pour modifier ce profil');
      alert('Vous n\'avez pas les droits nécessaires pour modifier ce profil');
      return;
    }

    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      // Entrer en mode édition - initialiser le formulaire avec les valeurs actuelles
      this.initForm();
    } else {
      // Sortir du mode édition sans sauvegarder - réinitialiser le formulaire
      this.initForm();
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Vérifier si le fichier est une image
      if (!file.type.startsWith('image/')) {
        // console.error('Le fichier doit être une image');
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // console.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      this.selectedFile = file;

      try {
        // Convertir l'image en base64
        const base64Image = await this.convertToBase64(file);
        this.imagePreview = base64Image;

        // Mettre à jour le profil avec l'image base64
        await this.usersService.updateUserProfileWithBase64Image(
          this.userId,
          {
            userName: this.user?.userName,
            email: this.user?.email,
            role: this.user?.role
          },
          base64Image
        );

        // Recharger les données utilisateur
        this.loadUserData();

        // Show success notification
        this.showNotification = true;
        this.notificationType = 'success';
        this.notificationMessage = 'Photo de profil mise à jour avec succès';
        setTimeout(() => this.showNotification = false, 3000);

        // console.log('Image de profil mise à jour avec succès');
      } catch (error) {
        // console.error('Erreur lors du traitement de l\'image:', error);
      }
    }
  }

  private async convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        resolve(base64);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }

  getUserProfileImage(): string {
    // Utiliser l'image base64 si disponible
    if (this.user?.userImageUrl?.base64) {
      return this.user.userImageUrl.base64;
    }
    // Sinon utiliser l'URL
    if (this.user?.userImageUrl?.url) {
      return this.user.userImageUrl.url;
    }
    // En dernier recours, utiliser l'image par défaut
    return 'assets/images/icons/userIcon.png';
  }

  async updateProfile() {
    if (!this.user || !this.profileForm.valid) {
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationMessage = 'Le formulaire est invalide. Veuillez vérifier les champs.';
      setTimeout(() => this.showNotification = false, 3000);
      return;
    }

    this.isLoading = true;

    try {
      // Récupérer les données du formulaire
      const updatedData = {
        userName: this.profileForm.value.userName,
        bio: this.profileForm.value.bio,
        socialLinks: {
          github: this.profileForm.value.github,
          linkedin: this.profileForm.value.linkedin,
          twitter: this.profileForm.value.twitter
        },
        // Conserver l'image de profil existante
        userImageUrl: this.user.userImageUrl
      };

      // console.log('Données à mettre à jour:', updatedData);

      // Mettre à jour le profil utilisateur dans Firestore
      await firstValueFrom(this.usersService.updateUserProfile(this.userId, updatedData));

      // Mettre à jour l'objet user local
      this.user = {
        ...this.user,
        ...updatedData
      };

      // Afficher une notification de succès
      this.showNotification = true;
      this.notificationType = 'success';
      this.notificationMessage = 'Profil mis à jour avec succès!';
      setTimeout(() => this.showNotification = false, 3000);

      // Désactiver le mode édition
      this.isEditing = false;

      // Recharger les données utilisateur pour voir les changements
      this.loadUserData();
    } catch (error) {
      // console.error('Erreur lors de la mise à jour du profil:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Convertir un Timestamp Firebase en Date JavaScript
  convertTimestampToDate(timestamp: any): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      // C'est un Timestamp Firebase
      return new Date(timestamp.seconds * 1000);
    }

    // Si c'est déjà un nombre ou une chaîne de caractères, essayer de créer une Date
    return new Date(timestamp);
  }

  loadUserSharedLinks() {
    if (!this.userId) {
      // console.error('Impossible de charger les liens: userId manquant');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    // console.log('Chargement des liens pour utilisateur avec ID:', this.userId);

    // Récupérer TOUS les liens puis filtrer côté client 
    const subscription = this.linksService.getLinks().subscribe({
      next: (allLinks) => {
        // console.log('Total des liens disponibles:', allLinks.length);

        // Convertir toutes les dates Timestamp en objets Date JavaScript
        const linksWithFixedDates = allLinks.map(link => ({
          ...link,
          createdAt: this.convertTimestampToDate(link.createdAt)
        }));

        // Filtrer UNIQUEMENT les liens créés par cet utilisateur spécifique
        const userLinks = linksWithFixedDates.filter(link => link.createdBy === this.userId);
        // console.log(`Liens filtrés pour cet utilisateur (${this.userId}):`, userLinks.length);

        if (userLinks.length > 0) {
          // console.log('Liens trouvés pour cet utilisateur:', userLinks);
          this.userSharedLinks = userLinks;
        } else {
          // console.log('Aucun lien trouvé avec cet ID utilisateur. Valeurs createdBy dans les liens:',
          //   [...new Set(allLinks.map(link => link.createdBy))]);

          // Si l'utilisateur courant est celui qu'on consulte, essayer avec l'UID Firebase
          const firebaseUser = this.authService.getCurrentUser();
          if (firebaseUser && firebaseUser.uid) {
            // console.log('Tentative avec Firebase UID:', firebaseUser.uid);

            const firebaseUserLinks = linksWithFixedDates.filter(link => link.createdBy === firebaseUser.uid);
            if (firebaseUserLinks.length > 0) {
              // console.log('Liens trouvés avec Firebase UID:', firebaseUserLinks);
              this.userSharedLinks = firebaseUserLinks;
            } else {
              this.userSharedLinks = [];
            }
          } else {
            this.userSharedLinks = [];
          }
        }

        this.isLoading = false;
      },
      error: (error) => {
        // console.error('Erreur lors du chargement des liens:', error);
        this.isLoading = false;
        this.userSharedLinks = [];
      }
    });

    this.subscriptions.push(subscription);
  }

  trackById(index: number, link: Link): string {
    return link.id || index.toString();
  }

  async toggleLinkLike(link: Link) {
    const userId = this.currentUser?.id;
    if (!userId || !link.id) {
      // console.error('Cannot like link: Missing user ID or link ID');
      return;
    }

    try {
      await this.linksService.toggleLike(link.id, userId);

      // Mettre à jour l'état local du lien
      const likedBy = link.likedBy || [];
      const isLiked = likedBy.includes(userId);

      link.likedBy = isLiked
        ? likedBy.filter(id => id !== userId)
        : [...likedBy, userId];

      link.likes = link.likedBy.length;
    } catch (error) {
      // console.error('Error toggling link like:', error);
    }
  }

  isLinkLikedByCurrentUser(link: Link): boolean {
    return link.likedBy?.includes(this.currentUser?.id || '') || false;
  }
}
