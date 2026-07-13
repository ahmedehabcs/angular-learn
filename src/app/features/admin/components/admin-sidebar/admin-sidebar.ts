import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  imports: [],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  readonly open = input(false);
  readonly closeSidebar = output<void>();
}
