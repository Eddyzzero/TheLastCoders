import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';
import { UsersService } from '../../../../core/services/users.service';
import { Link } from '../../interfaces/link.interface';
import { NavBarComponent } from '../../../../core/components/nav-bar/nav-bar.component';
import { AuthService } from '../../../../core/services/fireAuth.service';

@Component({
  selector: 'app-link-detail',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.css']
})
export class LinkDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private linksService = inject(LinksService);
  protected userService = inject(UsersService);
  private authService = inject(AuthService);

  link: Link | null = null;
  isOwner = false;
  showDeleteConfirm = false;
  deleteError = '';
  isDeleting = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.linksService.getLinkById(id).subscribe(link => {
          this.link = link;

          // Vérifier si l'utilisateur actuel est le créateur de ce lien
          const currentUser = this.authService.getCurrentUser();
          this.isOwner = !!(currentUser && link && currentUser.uid === link.createdBy);
        });
      }
    });
  }

  toggleDeleteConfirm() {
    this.showDeleteConfirm = !this.showDeleteConfirm;
    this.deleteError = '';
  }

  async deleteLink() {
    if (!this.link || !this.link.id) {
      this.deleteError = "Impossible de supprimer: ID de lien invalide";
      return;
    }

    this.isDeleting = true;
    try {
      await this.linksService.deleteLink(this.link.id);
      // Rediriger vers la page d'accueil après suppression
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.isDeleting = false;
      console.error("Erreur lors de la suppression:", error);
      this.deleteError = error.message || "Une erreur s'est produite lors de la suppression";
    }
  }
} 