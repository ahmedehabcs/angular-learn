import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Router, RouterLink } from '@angular/router';
import { form, FormRoot, FormField, minLength, required, email } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { LoginData } from '../../models/auth.model';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormRoot, FormField, LucideLoaderCircle],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthApiService);
  private readonly router = inject(Router);
  protected readonly loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected readonly loginForm = form(
    this.loginModel,
    (path) => {
      required(path.email, { message: 'email is required' });
      email(path.email, { message: 'Enter a valid email' });

      required(path.password, { message: 'password is required' });
      minLength(path.password, 6, {
        message: 'password must be at least 6 characters',
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const res = await firstValueFrom(this.authService.login(field().value()));
            await this.router.navigate(['/profile']);
            return;

          } catch (error) {
            console.error('Login failed:', error);

            return {
              kind: 'server',
              message: this.getErrorMessage(error),
            };
          }
        },
      },
    },
  );
  private getErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'An unexpected error occurred';
    }

    if (error.status === 0) {
      return 'Cannot connect to the server';
    }

    if (error.status === 401) {
      return 'Invalid email or password';
    }

    return error.error?.message ?? 'Login failed';
  }
}
