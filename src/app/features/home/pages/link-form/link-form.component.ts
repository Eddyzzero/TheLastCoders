import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';

@Component({
    selector: 'app-link-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './link-form.component.html',
})
export class LinkFormComponent {
    private fb = inject(FormBuilder);
    private linksService = inject(LinksService);
    private router = inject(Router);

    @Output() linkAdded = new EventEmitter<void>();

    categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Intelligence Artificiel'];
    errorMessage = '';
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    base64Image: string | null = null;
    base64Ready = false;

    // validateur pour l'URL
    // Vérifie si l'URL commence par http:// ou https://
    private urlValidator(control: AbstractControl): ValidationErrors | null {
        const url = control.value;
        if (!url) return null;
        const urlPattern = /^https?:\/\/.+/;
        return urlPattern.test(url) ? null : { invalidUrlFormat: true };
    }

    linkForm = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        url: ['', [Validators.required, this.urlValidator]],
        category: ['', [Validators.required]],
        niveau: ['Junior'],
        isPaid: [false],
        type: ['Cours'],
        tags: [[]]
    });

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            this.base64Ready = false;
            this.base64Image = null;

            this.convertToBase64Simple(input.files[0]);
        }
    }

    private convertToBase64Simple(file: File): void {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target && e.target.result) {
                const result = e.target.result as string;
                this.imagePreview = result;
                this.base64Image = result;
                this.base64Ready = true;
            }
        };

        reader.onerror = () => {
            this.errorMessage = "Impossible de lire l'image. Veuillez réessayer.";
        };

        reader.readAsDataURL(file);
    }

    async onSubmit() {
        if (this.linkForm.valid && this.base64Ready && this.base64Image) {
            try {
                await this.linksService.createLinkWithBase64Image(this.linkForm.value as any, this.base64Image);
                this.linkAdded.emit();
                this.resetForm();
                this.router.navigate(['/home']);
            } catch (error: any) {
                this.errorMessage = error.message;
            }
        } else if (!this.base64Ready) {
            this.errorMessage = "Veuillez sélectionner une image";
        } else if (!this.linkForm.valid) {
            this.errorMessage = "Veuillez remplir tous les champs obligatoires";
        }
    }

    getFormValidationErrors() {
        const errors: any = {};
        Object.keys(this.linkForm.controls).forEach(key => {
            const control = this.linkForm.get(key);
            if (control && !control.valid) {
                errors[key] = control.errors;
            }
        });
        return errors;
    }

    resetForm(): void {
        this.linkForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;
        this.base64Image = null;
        this.base64Ready = false;
        this.errorMessage = '';
    }
}
