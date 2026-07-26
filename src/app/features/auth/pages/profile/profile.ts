import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api.service';

interface ProfileForm {
  fullName: string;
  email: string;
  image: string;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthApiService);
  private selectedImage: File | null = null;

  protected readonly profile = signal<ProfileForm>({
    fullName: '',
    email: '',
    image: '',
  });

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (user) => {
        this.profile.set({
          fullName: user.fullName,
          email: user.email,
          image: user.image ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your profile.');
        this.loading.set(false);
      },
    });
  }

  protected updateFullName(fullName: string): void {
    this.profile.update((profile) => ({ ...profile, fullName }));
  }

  protected updateEmail(email: string): void {
    this.profile.update((profile) => ({ ...profile, email }));
  }

  protected selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please choose an image file.');
      return;
    }

    this.selectedImage = file;
    this.errorMessage.set('');

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.update((profile) => ({
        ...profile,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }

  protected saveProfile(): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = new FormData();
    data.append('fullName', this.profile().fullName);
    data.append('email', this.profile().email);

    if (this.selectedImage) {
      data.append('image', this.selectedImage);
    }

    this.authService.updateProfile(data).subscribe({
      next: (user) => {
        this.profile.update((profile) => ({
          ...profile,
          fullName: user.fullName,
          email: user.email,
          image: user.image ?? profile.image,
        }));
        this.successMessage.set('Profile updated successfully.');
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not update your profile.');
        this.saving.set(false);
      },
    });
  }
}
