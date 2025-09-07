import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './star-rating.component.html',
})
export class StarRatingComponent {
    @Input() rating = 0;
    @Input() totalRatings = 0;
    @Input() showRatingCount = true;
    @Input() readonly = false;
    @Output() ratingChange = new EventEmitter<number>();

    stars = Array(5).fill(null).map(() => ({ filled: false }));

    ngOnInit() {
        this.updateStars(this.rating);
    }

    ngOnChanges() {
        this.updateStars(this.rating);
    }

    hover(rating: number) {
        if (this.readonly) return;
        // Si l'utilisateur n'a pas encore noté (rating = 0), on affiche la note potentielle
        if (this.rating === 0) {
            this.updateStars(rating);
        }
        // Sinon, on ne change rien au survol
    }

    rate(rating: number) {
        if (this.readonly) return;
        this.rating = rating;
        this.ratingChange.emit(rating);
    }

    private updateStars(rating: number) {
        this.stars.forEach((star, index) => {
            star.filled = index < rating;
        });
    }
}
