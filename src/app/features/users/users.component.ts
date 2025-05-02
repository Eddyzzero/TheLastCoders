import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserInterface } from '../auth/interfaces/user.interface';
import { AuthService } from '../../core/services/fireAuth.service';
import { UsersService } from '../../core/services/users.service';
import { LinksService } from '../../core/services/links.service';
import { Link } from '../../features/home/interfaces/link.interface';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  // Injection des services
  private router = inject(Router);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private linksService = inject(LinksService);
  private fb = inject(FormBuilder);

  // Propriétés de classe
  user: UserInterface | null = null;
  profileForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditing = false;
  userSharedLinks: Link[] = [];
  userId: string = '';

  constructor() {
    this.profileForm = this.fb.group({
      userName: [''],
      bio: [''],
      github: [''],
      linkedin: [''],
      twitter: ['']
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserSignal();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = currentUser.id || '';

    if (this.userId) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    this.usersService.getUserById(this.userId).subscribe({
      next: (userDoc) => {
        this.user = userDoc;
        if (this.user) {
          this.initForm();
          this.loadUserSharedLinks();
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Si on quitte le mode édition sans sauvegarder, on réinitialise le formulaire
      this.profileForm.patchValue(this.user || {});
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async updateProfile() {
    if (this.user && this.profileForm.valid) {
      const updatedData = {
        ...this.user,
        ...this.profileForm.value,
        socialLinks: {
          github: this.profileForm.value.github,
          linkedin: this.profileForm.value.linkedin,
          twitter: this.profileForm.value.twitter
        }
      };

      try {
        // TODO: Implémenter la mise à jour du profil avec le service
        console.log('Profile updated:', updatedData);
        this.isEditing = false; // Désactive le mode édition après la sauvegarde
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

  loadUserSharedLinks() {
    if (this.userId) {
      this.linksService.getLinksByUser(this.userId).subscribe(
        (links) => {
          this.userSharedLinks = links;
        },
        (error) => {
          console.error('Error loading user links:', error);
        }
      );
    }
  }
}
