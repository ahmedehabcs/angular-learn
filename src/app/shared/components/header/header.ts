import { Component, signal, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LucideHouse, LucideMenu, LucideX } from "@lucide/angular";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideHouse, LucideMenu, LucideX],
  templateUrl: './header.html',
})
export class Header {
  readonly appName = input<string>('AngularApp');
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}