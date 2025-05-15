import { Component, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { Link } from '../../interfaces/link.interface';
import { Comment } from '../../interfaces/comment.interface';
import { NavBarComponent } from '../../../../core/components/nav-bar/nav-bar.component';
import { UserInterface } from '../../../auth/interfaces/user.interface';
import { Subscription, map } from 'rxjs';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Timestamp, collection, query, where, orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-link-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent, ReactiveFormsModule],
  templateUrl: './link-detail.component.html'
})
export class LinkDetailComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private linksService = inject(LinksService);
  private authService = inject(AuthService);
  private userService = inject(UsersService);
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);

  link: Link | null = null;
  isOwner = false;
  showDeleteConfirm = false;
  isDeleting = false;
  deleteError: string | null = null;

  comments: Comment[] = [];
  commentForm: FormGroup;
  isSubmitting = false;
  currentUser: UserInterface | null = null;
  private subscriptions: Subscription[] = [];

  constructor() {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]]
    });

    effect(() => {
      const user = this.authService.currentUserSignal();
      if (user !== undefined) {
        this.currentUser = user;
      }
    });
  }

  ngOnInit() {
    const linkId = this.route.snapshot.paramMap.get('id');
    if (linkId) {
      this.loadLink(linkId);
      this.loadComments();
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadLink(linkId: string) {
    this.linksService.getLinkById(linkId).subscribe({
      next: (link) => {
        this.link = link;
        this.checkOwnership();
      },
      error: (error) => {
        console.error('Error loading link:', error);
        this.router.navigate(['/home']);
      }
    });
  }

  private checkOwnership() {
    if (!this.link) return;
    const currentUser = this.authService.getCurrentUser();
    this.isOwner = currentUser?.uid === this.link.createdBy;
  }

  async addComment() {
    // Vérifier si l'utilisateur est authentifié avec Firebase
    const firebaseUser = this.authService.getCurrentUser();
    if (!firebaseUser) {
      console.error('User must be authenticated to add comments');
      // Rediriger vers la page de connexion
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.commentForm.valid || this.isSubmitting || !this.currentUser || !this.link) {
      console.error('Form validation failed or missing required data');
      return;
    }

    if (!this.currentUser.id || !this.link.id) {
      console.error('Missing required IDs');
      return;
    }

    this.isSubmitting = true;
    const commentText = this.commentForm.get('text')?.value?.trim();

    if (!commentText) {
      this.isSubmitting = false;
      return;
    }

    try {
      // Créer le commentaire avec le type correct et l'UID Firebase
      const commentData: Comment = {
        text: commentText,
        senderId: firebaseUser.uid, // Utiliser l'UID Firebase au lieu de l'ID utilisateur
        senderName: this.currentUser.userName || 'Utilisateur Anonyme',
        linkId: this.link.id,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
        read: false,
        isEdited: false,
        ...(this.currentUser.profileImage && { senderImage: this.currentUser.profileImage })
      };

      console.log('Attempting to add comment with data:', {
        senderId: commentData.senderId,
        linkId: commentData.linkId
      });

      const commentId = await this.firestoreService.addDocument('comments', commentData);

      if (!commentId) {
        throw new Error('Failed to create comment');
      }

      console.log('Comment added successfully with ID:', commentId);

      this.commentForm.reset();
      // Attendre un peu avant de recharger pour laisser Firestore se mettre à jour
      setTimeout(() => this.loadComments(), 500);
    } catch (error) {
      console.error('Error adding comment:', error);
      // Afficher un message d'erreur à l'utilisateur
      this.deleteError = "Erreur lors de l'ajout du commentaire. Veuillez réessayer.";
    } finally {
      this.isSubmitting = false;
    }
  }

  private loadComments() {
    if (!this.link?.id) return;

    const commentsSub = this.firestoreService.getCollection('comments', ref =>
      query(
        ref,
        where('linkId', '==', this.link!.id),
        orderBy('createdAt', 'desc')
      )
    ).subscribe(comments => {
      this.comments = comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt instanceof Timestamp
          ? comment.createdAt.toDate()
          : new Date(comment.createdAt)
      }));
    });

    this.subscriptions.push(commentsSub);
  }

  async toggleLike(comment: Comment) {
    if (!this.currentUser?.id || !comment.id) {
      console.error('Cannot like comment: Missing user ID or comment ID');
      return;
    }

    const userId = this.currentUser.id;
    const likedBy = comment.likedBy || [];
    const isLiked = likedBy.includes(userId);

    try {
      const updatedLikedBy = isLiked
        ? likedBy.filter(id => id !== userId)
        : [...likedBy, userId];

      await this.firestoreService.updateDocument(`comments/${comment.id}`, {
        likedBy: updatedLikedBy,
        likes: updatedLikedBy.length
      });

      // Mettre à jour l'état local immédiatement
      comment.likedBy = updatedLikedBy;
      comment.likes = updatedLikedBy.length;
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  isLikedByCurrentUser(comment: Comment): boolean {
    return comment.likedBy?.includes(this.currentUser?.id || '') || false;
  }

  canDeleteComment(comment: Comment): boolean {
    return this.currentUser?.id === comment.senderId || this.isOwner;
  }

  async deleteComment(comment: Comment) {
    if (!this.canDeleteComment(comment)) {
      console.error('User does not have permission to delete this comment');
      return;
    }

    if (!comment.id) {
      console.error('Cannot delete comment: Comment ID is missing');
      return;
    }

    try {
      await this.firestoreService.deleteDocument(`comments/${comment.id}`);

      // Update local state immediately
      this.comments = this.comments.filter(c => c.id !== comment.id);

      // Reload comments to ensure consistency
      this.loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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