import { Component, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
    protected userService = inject(UsersService);
    private cdr = inject(ChangeDetectorRef);

    @Output() viewModeChange = new EventEmitter<'grid' | 'carousel'>();
    @Output() searchToggle = new EventEmitter<void>();

    public isMenuOpen = false;
    viewMode: 'grid' | 'carousel' = 'carousel';

    menuItems = [
        { label: 'CARDS', route: '/home' },
        { label: 'COMMUNAUTÉ', route: '/community' },
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
        this.searchToggle.emit();
    }
} 