import { Component, computed, inject, signal, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LucideHouse, LucideMenu, LucideShoppingCart, LucideX } from "@lucide/angular";
import { AuthApiService } from '../../../features/auth/services/auth-api.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideHouse, LucideMenu, LucideShoppingCart, LucideX],
  templateUrl: './header.html',
})
export class Header {
  private readonly authService = inject(AuthApiService);

  readonly appName = input<string>('Intercom');
  protected readonly isMenuOpen = signal(false);
  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
