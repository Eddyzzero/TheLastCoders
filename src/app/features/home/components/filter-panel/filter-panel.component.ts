import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filters } from '../../interfaces/filter.interface';

@Component({
    selector: 'app-filter-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
    @Output() filterChange = new EventEmitter<Filters>();
    @Output() close = new EventEmitter<void>();

    isOpen = false;

    niveauOptions = ['Junior', 'Médior', 'Senior'];
    langageOptions = ['HTML', 'CSS', 'JavaScript', 'Python', 'Git', 'Algorithme', 'C', 'Java', 'PHP', 'React', 'Angular', 'Vue.js', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure'];
    prixOptions = ['Gratuit', 'Payant'];
    typeOptions = ['Cours', 'Projet', 'Forum', 'Exercice', 'Tutoriel', 'Documentation', 'Vidéo', 'Podcast'];

    selectedFilters: Filters = {
        niveau: [],
        langage: [],
        prix: [],
        type: []
    };

    openFilters(): void {
        this.isOpen = true;
    }

    closeFilters(): void {
        this.isOpen = false;
        this.close.emit();
    }

    toggleFilter(category: keyof Filters, value: string): void {
        const index = this.selectedFilters[category].indexOf(value);
        if (index === -1) {
            this.selectedFilters[category].push(value);
            console.log('FilterPanel: Ajout du filtre', category, value, 'Nouveaux filtres:', this.selectedFilters);
        } else {
            this.selectedFilters[category].splice(index, 1);
            console.log('FilterPanel: Suppression du filtre', category, value, 'Nouveaux filtres:', this.selectedFilters);
        }
    }

    isSelected(category: keyof Filters, value: string): boolean {
        return this.selectedFilters[category].includes(value);
    }

    resetFilters(): void {
        this.selectedFilters = {
            niveau: [],
            langage: [],
            prix: [],
            type: []
        };
    }

    applyFilters(): void {
        console.log('FilterPanel: Émission des filtres:', this.selectedFilters);
        this.filterChange.emit({ ...this.selectedFilters });
        this.closeFilters();
    }
} 