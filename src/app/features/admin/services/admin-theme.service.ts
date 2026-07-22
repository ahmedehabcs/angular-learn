import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminTheme {
  private readonly storageKey = 'admin-theme';

  readonly darkMode = signal(
    localStorage.getItem(this.storageKey) === 'dark'
  );

  readonly isDarkMode = this.darkMode.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, this.darkMode() ? 'dark' : 'light');
    })
  }

  toggle(): void {
    this.darkMode.update(val => !val);
  }
}