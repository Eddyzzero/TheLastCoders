import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';

@Component({
    selector: 'app-link-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './link-form.component.html',
})
export class LinkFormComponent {
    private fb = inject(FormBuilder);
    private linksService = inject(LinksService);
    private router = inject(Router);

    @Output() linkAdded = new EventEmitter<void>();

    categories = ['Frontend', 'Backend', 'DevOps', 'Mobile'];
    errorMessage = '';
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    linkForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        route: ['', Validators.required],
        category: ['', Validators.required]
    });

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            // Créer un aperçu de l'image
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    async onSubmit() {
        if (this.linkForm.valid && this.selectedFile) {
            try {
                await this.linksService.createLinkWithImage(this.linkForm.value as any, this.selectedFile);
                this.linkAdded.emit();
            } catch (error: any) {
                this.errorMessage = error.message;
            }
        } else if (!this.selectedFile) {
            this.errorMessage = "Veuillez sélectionner une image";
        }
    }
}
