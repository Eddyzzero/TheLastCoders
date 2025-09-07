import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';
import { NotificationComponent } from '../../../../core/components/notification/notification.component';

@Component({
    selector: 'app-link-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NotificationComponent
    ],
    templateUrl: './link-form.component.html',
})
export class LinkFormComponent {
    private fb = inject(FormBuilder);
    private linksService = inject(LinksService);
    private router = inject(Router);

    @Output() linkAdded = new EventEmitter<void>();


    // Options pour les critères de filtrage
    niveauOptions = ['Junior', 'Médior', 'Senior'];
    langageOptions = ['HTML', 'CSS', 'JavaScript', 'Python', 'Git', 'Algorithme', 'C', 'Java', 'PHP', 'React', 'Angular', 'Vue.js', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure'];
    typeOptions = ['Cours', 'Projet', 'Forum', 'Exercice', 'Tutoriel', 'Documentation', 'Vidéo', 'Podcast'];

    selectedFile: File | null = null;
    imagePreview: string | null = null;
    base64Image: string | null = null;
    base64Ready = false;

    // Notification properties
    showNotification = false;
    notificationType: 'success' | 'error' | 'info' | 'warning' = 'error';
    notificationMessage = '';

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
        niveau: ['Junior', [Validators.required]],
        isPaid: [false],
        type: ['Cours', [Validators.required]],
        tags: [[''] as string[], [Validators.required, Validators.minLength(1)]]
    });

    // Méthode pour ajouter/supprimer un tag
    toggleTag(tag: string): void {
        const currentTags = this.linkForm.get('tags')?.value || [];
        const index = currentTags.indexOf(tag);

        if (index === -1) {
            // Ajouter le tag
            this.linkForm.patchValue({ tags: [...currentTags, tag] });
        } else {
            // Supprimer le tag
            const newTags = currentTags.filter((_, i) => i !== index);
            this.linkForm.patchValue({ tags: newTags });
        }
    }

    // Méthode pour vérifier si un tag est sélectionné
    isTagSelected(tag: string): boolean {
        const currentTags = this.linkForm.get('tags')?.value || [];
        return currentTags.includes(tag);
    }

    // Méthode pour obtenir les tags sélectionnés de manière sûre
    getSelectedTags(): string[] {
        const tags = this.linkForm.get('tags')?.value || [];
        return tags.filter(tag => tag && tag !== '');
    }

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
            this.showNotification = true;
            this.notificationType = 'error';
            this.notificationMessage = "Impossible de lire l'image. Veuillez réessayer.";
        };

        reader.readAsDataURL(file);
    }

    showSuccessMessage = false;

    async onSubmit() {
        if (this.linkForm.valid && this.base64Ready && this.base64Image) {
            try {
                await this.linksService.createLinkWithBase64Image(this.linkForm.value as any, this.base64Image);
                this.linkAdded.emit();

                // Show success notification
                this.showNotification = true;
                this.notificationType = 'success';
                this.notificationMessage = 'Le lien a été créé avec succès!';

                // Reset form and redirect after 3 seconds
                setTimeout(() => {
                    this.resetForm();
                    this.router.navigate(['/home']);
                }, 3000);

            } catch (error: any) {
                this.showNotification = true;
                this.notificationType = 'error';
                this.notificationMessage = error.message;
            }
        } else if (!this.base64Ready) {
            this.showNotification = true;
            this.notificationType = 'warning';
            this.notificationMessage = "Veuillez sélectionner une image";
        } else if (!this.linkForm.valid) {
            this.showNotification = true;
            this.notificationType = 'error';
            this.notificationMessage = "Veuillez remplir tous les champs obligatoires";
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
        this.linkForm.reset({
            niveau: 'Junior',
            isPaid: false,
            type: 'Cours',
            tags: ['']
        });
        this.selectedFile = null;
        this.imagePreview = null;
        this.base64Image = null;
        this.base64Ready = false;
        this.showNotification = false;
    }

    onNotificationClosed(): void {
        this.showNotification = false;
    }
}
