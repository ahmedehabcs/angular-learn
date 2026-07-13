import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormRoot, FormField, minLength, required } from '@angular/forms/signals';
import { RegisterData } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormRoot, FormField],
  templateUrl: './register.html',
})
export class Register {
  protected readonly registerModel = signal<RegisterData>({
    fullName: '',
    email: '',
    password: '',
  });

  protected readonly registerForm = form(
    this.registerModel,
    (path) => {
      required(path.fullName, {
        message: 'Full name is required',
      });

      minLength(path.fullName, 3, {
        message: 'Full name must be at least 3 characters',
      });
    },
    {
      submission: {
        action: async (submittedForm) => {
          const data: RegisterData = submittedForm().value();

          console.log('submitted data: ', data);
        },
      },
    },
  );
}
