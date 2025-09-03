import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users.service';
import { UserInterface } from '../../../auth/interfaces/user.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-management',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    private usersService = inject(UsersService);
    private router = inject(Router);

    users: UserInterface[] = [];
    isAdmin = false;
    loading = true;
    errorMessage = '';
    showRoleModal = false;
    selectedUser: UserInterface | null = null;

    ngOnInit(): void {
        this.checkAdminStatus();
    }

    // Vérifier si l'utilisateur est administrateur
    checkAdminStatus(): void {
        this.usersService.isCurrentUserAdmin().subscribe({
            next: (isAdmin) => {
                this.isAdmin = isAdmin;
                if (isAdmin) {
                    this.loadUsers();
                } else {
                    this.loading = false;
                }
            },
            error: (error) => {
                this.isAdmin = false;
                this.loading = false;
                this.errorMessage = 'Impossible de vérifier les droits d\'accès';
                console.error('Erreur lors de la vérification des droits:', error);
            }
        });
    }

    // Charger tous les utilisateurs
    loadUsers(): void {
        this.usersService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = 'Erreur lors du chargement des utilisateurs';
                console.error('Erreur lors du chargement des utilisateurs:', error);
            }
        });
    }

    // Changer le rôle d'un utilisateur
    changeUserRole(userId: string, newRole: 'reader' | 'author' | 'admin'): void {
        this.loading = true;

        this.usersService.changeUserRole(userId, newRole).subscribe({
            next: () => {
                console.log(`Rôle de l'utilisateur ${userId} changé en ${newRole}`);
                // Recharger la liste des utilisateurs
                this.loadUsers();
            },
            error: (error) => {
                this.loading = false;
                console.error('Erreur lors du changement de rôle:', error);
                alert(`Erreur: ${error.message}`);
            }
        });
    }

    // Supprimer un utilisateur
    deleteUser(userId: string): void {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            return;
        }

        this.loading = true;

        this.usersService.deleteUser(userId).subscribe({
            next: () => {
                console.log(`Utilisateur ${userId} supprimé`);
                // Recharger la liste des utilisateurs
                this.loadUsers();
            },
            error: (error) => {
                this.loading = false;
                console.error('Erreur lors de la suppression:', error);
                alert(`Erreur: ${error.message}`);
            }
        });
    }

    // Voir le profil d'un utilisateur
    viewUserProfile(userId: string): void {
        // Implémenter la navigation vers le profil de l'utilisateur
        this.router.navigate(['/user-profile', userId]);
    }

    // Retour à l'accueil
    navigateToHome(): void {
        this.router.navigate(['/home']);
    }

    openRoleModal(user: UserInterface) {
        this.selectedUser = user;
        this.showRoleModal = true;
    }

    closeRoleModal() {
        this.showRoleModal = false;
        this.selectedUser = null;
    }

    updateRole(newRole: 'reader' | 'author' | 'admin') {
        if (this.selectedUser && this.selectedUser.id) {
            this.loading = true;
            this.usersService.changeUserRole(this.selectedUser.id, newRole).subscribe({
                next: () => {
                    console.log(`Rôle de l'utilisateur ${this.selectedUser?.id} changé en ${newRole}`);
                    // Mettre à jour le rôle dans la liste locale
                    if (this.selectedUser) {
                        this.selectedUser.role = newRole;
                    }
                    this.closeRoleModal();
                    // Recharger la liste des utilisateurs
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('Erreur lors du changement de rôle:', error);
                    this.errorMessage = `Erreur: ${error.message}`;
                    this.loading = false;
                }
            });
        }
    }
}