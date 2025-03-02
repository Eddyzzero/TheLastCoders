import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.userName, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }
}
