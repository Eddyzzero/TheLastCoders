import { Component, inject, Output, EventEmitter, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/fireAuth.service';
import { FilterPanelComponent } from '../../../features/home/components/filter-panel/filter-panel.component';
import { Filters } from '../../../features/home/interfaces/filter.interface';
import { ViewModeService, ViewMode } from '../../services/view-mode.service';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule, RouterModule, FilterPanelComponent, RouterLink],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    @ViewChild(FilterPanelComponent) filterPanel!: FilterPanelComponent;

    protected userService = inject(UsersService);
    private cdr = inject(ChangeDetectorRef);
    private authService = inject(AuthService);
    private router = inject(Router);

    @Output() searchToggle = new EventEmitter<void>();
    @Output() filterChange = new EventEmitter<Filters>();

    public isMenuOpen = false;
    private viewModeService = inject(ViewModeService);
    public viewMode$ = this.viewModeService.viewMode$;

    menuItems = [
        { label: 'CARDS', route: '/home' },
        { label: 'POLICY PRIVACY', route: '/policy' }
    ];

    socialLinks: { github?: string; linkedin?: string; twitter?: string } = {};


    // obtenir l'user et ajouter les liens dans firebase apres ajout
    ngOnInit() {
        const uid = this.authService.getCurrentUser()?.uid;
        if (uid) {
            this.userService.getUserById(uid).subscribe(user => {
                this.socialLinks = user?.socialLinks || {};
                this.cdr.detectChanges();
            });
        }
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
        this.cdr.detectChanges();
    }

    toggleView(): void {
        this.viewModeService.toggleViewMode();

        // Si le mode de vue est carrousel, rediriger vers la page d'accueil
        if (this.viewModeService.getCurrentViewMode() === 'carousel') {
            this.router.navigate(['/home']);
        }
    }

    toggleSearch(): void {
        if (this.filterPanel) {
            if (!this.filterPanel.isOpen) {
                this.filterPanel.openFilters();
            } else {
                this.filterPanel.closeFilters();
            }
        } else {
            // Si le filterPanel n'est pas encore disponible, émettre l'événement de recherche
            this.searchToggle.emit();
        }
    }

    onFilterChange(filters: Filters): void {
        this.filterChange.emit(filters);
    }

    logOut(): void {
        this.authService.logOut().subscribe({
            next: () => {
                this.router.navigate(['/login-choice']);
            },
            error: (error) => {
                console.error('Erreur lors de la déconnexion:', error);
            }
        });
    }

    navigateToProfile() {
        this.router.navigate(['/users']);
    }
}