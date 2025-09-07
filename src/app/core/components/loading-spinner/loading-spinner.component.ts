import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant de chargement avec animation
 * 
 * Ce composant affiche une animation de chargement avec :
 * - Spinner personnalisable
 * - Message de chargement optionnel
 * - Taille et couleur configurables
 */
@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
    @Input() message: string = '';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
    @Input() containerClass: string = '';

    get spinnerSizeClass(): string {
        switch (this.size) {
            case 'small':
                return 'w-8 h-8 border-2';
            case 'large':
                return 'w-20 h-20 border-6';
            default:
                return 'w-12 h-12 border-4';
        }
    }

    get messageSizeClass(): string {
        switch (this.size) {
            case 'small':
                return 'text-sm';
            case 'large':
                return 'text-xl';
            default:
                return 'text-base';
        }
    }

    get spinnerColor(): string {
        switch (this.color) {
            case 'success':
                return '#72B01D';
            case 'warning':
                return '#f39c12';
            case 'danger':
                return '#e74c3c';
            default:
                return '#3498db';
        }
    }
}
