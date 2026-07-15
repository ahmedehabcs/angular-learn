import { Component, inject, input, output, signal, effect } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminTheme } from '../../services/admin-theme';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-admin-sidebar',
  imports: [MatSlideToggleModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  readonly open = input(false);
  readonly closeSidebar = output<void>();
  protected readonly theme = inject(AdminTheme);


}
