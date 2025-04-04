import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';

@Component({
    selector: 'app-link-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './link-form.component.html',
})
export class LinkFormComponent {
    private fb = inject(FormBuilder);
    private linksService = inject(LinksService);
    private router = inject(Router);

    categories = ['Frontend', 'Backend', 'DevOps', 'Mobile'];
    errorMessage = '';

    linkForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        imageUrl: ['', Validators.required],
        route: ['', Validators.required],
        category: ['', Validators.required]
    });

    async onSubmit() {
        if (this.linkForm.valid) {
            try {
                await this.linksService.createLink(this.linkForm.value as any);
                this.router.navigate(['/home']);
            } catch (error: any) {
                this.errorMessage = error.message;
            }
        }
    }
}
