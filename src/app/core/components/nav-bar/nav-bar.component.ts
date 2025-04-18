import { Component, inject, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/fireAuth.service';
import { FilterPanelComponent, Filters } from '../../../features/home/components/filter-panel/filter-panel.component';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule, RouterModule, FilterPanelComponent],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
    @ViewChild(FilterPanelComponent) filterPanel!: FilterPanelComponent;

    protected userService = inject(UsersService);
    private cdr = inject(ChangeDetectorRef);
    private authService = inject(AuthService);
    private router = inject(Router);

    @Output() viewModeChange = new EventEmitter<'grid' | 'carousel'>();
    @Output() searchToggle = new EventEmitter<void>();
    @Output() filterChange = new EventEmitter<Filters>();

    public isMenuOpen = false;
    viewMode: 'grid' | 'carousel' = 'carousel';

    menuItems = [
        { label: 'CARDS', route: '/home' },
        { label: 'COMMUNAUTÉ', route: '/home' },
        { label: 'POLICY PRIVACY', route: '/privacy' }
    ];

    constructor() {
        console.log('NavBarComponent initialized');
    }

    toggleMenu(): void {
        console.log('Bouton cliqué!');
        this.isMenuOpen = !this.isMenuOpen;
        console.log('État du menu:', this.isMenuOpen);
        this.cdr.detectChanges();
    }

    toggleView(): void {
        this.viewMode = this.viewMode === 'grid' ? 'carousel' : 'grid';
        this.viewModeChange.emit(this.viewMode);
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
                console.log('Déconnexion réussie');
                this.router.navigate(['/login-choice']);
            },
            error: (error) => {
                console.error('Erreur lors de la déconnexion:', error);
            }
        });
    }
} 