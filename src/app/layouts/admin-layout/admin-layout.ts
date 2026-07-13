import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from '../../features/admin/components/admin-header/admin-header';
import { AdminSidebar } from '../../features/admin/components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminHeader, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  protected readonly sidebarOpen = signal<boolean>(false);
  protected openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}