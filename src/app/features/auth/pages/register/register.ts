import { Component, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { RouterLink } from '@angular/router';
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
            const data = await firstValueFrom(this.authApi.register(field().value()));
            console.log(data);
            return;
          } catch (error) {
            console.log(error);
            return {
              kind: "serverError",
              message: "registeration faild"
            }
          }
        }
      }
    }
  )
}