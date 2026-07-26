import { Component, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Router, RouterLink } from '@angular/router';
import { form, FormRoot, FormField, minLength, required, email } from '@angular/forms/signals';
import { RegisterData } from '../../models/auth.model';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormRoot, FormField],
  templateUrl: './register.html',
})
export class Register {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  protected readonly registerModel = signal<RegisterData>({
    fullName: '',
    email: '',
    password: ''
  })

  protected readonly registerForm = form(
    this.registerModel,
    (path) => {
      required(path.fullName, { message: "full name is required" });
      minLength(path.fullName, 6, { message: "full name is at least 6 characters" });

      required(path.email, { message: "email is required" });
      email(path.email, { message: 'email must be valid' });

      required(path.password, { message: 'password is required' });
      minLength(path.password, 6, { message: 'password must be at least 6 characters' });

    },
    {
      submission: {
        action: async (field) => {
          try {
            const response = await firstValueFrom(this.authApi.register(field().value()));
            localStorage.setItem('token', response.accessToken);
            await this.router.navigate(['/profile']);
            return;
          } catch (error) {
            return {
              kind: "server",
              message: this.getErrorMessage(error)
            }
          }
        }
      }
    }
  )

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && 'error' in error) {
      const httpError = error as { error?: { message?: string } };
      return httpError.error?.message ?? 'Registration failed';
    }

    return 'Registration failed';
  }
}
