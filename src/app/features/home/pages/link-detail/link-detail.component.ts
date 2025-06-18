import { Component, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { Link } from '../../interfaces/link.interface';
import { Comment } from '../../interfaces/comment.interface';
import { UserInterface } from '../../../auth/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Timestamp, query, where, orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-link-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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

  showCommentDeleteConfirm = false;
  commentToDelete: Comment | null = null;

  constructor() {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]]
    });

    effect(() => {
      const user = this.authService.currentUserSignal();
      if (user) {
        // Charger les données complètes de l'utilisateur pour avoir l'image
        this.userService.getUserById(user.id || '').subscribe(fullUser => {
          this.currentUser = fullUser;
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnInit() {
    const linkId = this.route.snapshot.paramMap.get('id');
    if (linkId) {
      this.loadLink(linkId);
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
        this.loadComments();
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
        ...(this.currentUser.userImageUrl?.base64 && { senderImage: this.currentUser.userImageUrl.base64 })
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
    ).subscribe({
      next: (comments) => {
        this.comments = comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt instanceof Timestamp
            ? comment.createdAt.toDate()
            : new Date(comment.createdAt)
        }));
        console.log('Commentaires chargés:', this.comments);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des commentaires:', error);
        if (error.code === 'permission-denied') {
          console.error('Permission denied: User may not be authenticated');
          this.router.navigate(['/auth/login']);
        }
      }
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
      // Vérifier si le commentaire existe toujours
      const commentRef = await this.firestoreService.getDocument(`comments/${comment.id}`);
      if (!commentRef) {
        console.error('Comment not found in database');
        return;
      }

      // Supprimer le commentaire de Firebase
      await this.firestoreService.deleteDocument(`comments/${comment.id}`);
      console.log('Commentaire supprimé avec succès:', comment.id);

      // Mettre à jour la liste locale immédiatement
      this.comments = this.comments.filter(c => c.id !== comment.id);

      // Fermer la modale
      this.toggleCommentDeleteConfirm();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      // Vérifier si l'erreur est liée à l'authentification
      if (error.code === 'permission-denied') {
        console.error('Permission denied: User may not be authenticated');
        // Rediriger vers la page de connexion si nécessaire
        this.router.navigate(['/auth/login']);
      }
      // Afficher un message d'erreur à l'utilisateur
      this.deleteError = "Une erreur s'est produite lors de la suppression du commentaire. Veuillez réessayer.";
    }
  }

  toggleDeleteConfirm() {
    console.log('Toggle delete confirm, état actuel:', this.showDeleteConfirm);
    this.showDeleteConfirm = !this.showDeleteConfirm;
    this.deleteError = null;
    console.log('Nouvel état:', this.showDeleteConfirm);
  }

  async deleteLink() {
    console.log('Début de la suppression du lien');
    if (!this.link?.id) {
      console.error('ID de lien manquant');
      this.deleteError = "Impossible de supprimer: ID de lien invalide";
      return;
    }

    this.isDeleting = true;
    try {
      console.log('Tentative de suppression du lien:', this.link.id);
      await this.linksService.deleteLink(this.link.id);
      console.log('Lien supprimé avec succès');
      // Rediriger vers la page d'accueil après suppression
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error("Erreur détaillée lors de la suppression:", error);
      this.isDeleting = false;
      this.deleteError = error.message || "Une erreur s'est produite lors de la suppression";
    }
  }

  toggleCommentDeleteConfirm(comment?: Comment) {
    if (comment) {
      this.commentToDelete = comment;
    } else {
      this.commentToDelete = null;
    }
    this.showCommentDeleteConfirm = !this.showCommentDeleteConfirm;
  }

  async confirmDeleteComment() {
    if (!this.commentToDelete) return;

    try {
      await this.deleteComment(this.commentToDelete);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      this.deleteError = "Une erreur s'est produite lors de la suppression du commentaire. Veuillez réessayer.";
    }
  }

  async toggleLinkLike() {
    const userId = this.currentUser?.id;
    if (!userId || !this.link?.id) {
      console.error('Cannot like link: Missing user ID or link ID');
      return;
    }

    try {
      await this.linksService.toggleLike(this.link.id, userId);

      // Mettre à jour l'état local du lien
      if (this.link) {
        const likedBy = this.link.likedBy || [];
        const isLiked = likedBy.includes(userId);

        this.link.likedBy = isLiked
          ? likedBy.filter(id => id !== userId)
          : [...likedBy, userId];

        this.link.likes = this.link.likedBy.length;
      }
    } catch (error) {
      console.error('Error toggling link like:', error);
    }
  }

  isLinkLikedByCurrentUser(): boolean {
    return this.link?.likedBy?.includes(this.currentUser?.id || '') || false;
  }
}