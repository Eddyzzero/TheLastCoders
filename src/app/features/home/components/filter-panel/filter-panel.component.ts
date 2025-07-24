import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filters } from '../../interfaces/filter.interface';

@Component({
    selector: 'app-filter-panel',
    imports: [CommonModule, FormsModule],
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
    @Output() filterChange = new EventEmitter<Filters>();
    @Output() close = new EventEmitter<void>();

    isOpen = false;

    niveauOptions = ['Junior', 'Médior', 'Senior'];
    langageOptions = ['HTML', 'CSS', 'JavaScript', 'Python', 'Git', 'Algorithme', 'C'];
    prixOptions = ['Gratuit', 'Payant'];
    typeOptions = ['Cours', 'Projet', 'Forum', 'Exercice'];

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
        } else {
            this.selectedFilters[category].splice(index, 1);
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
        this.filterChange.emit({ ...this.selectedFilters });
        this.closeFilters();
    }
} 