import { Component, output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  readonly toggleSidebar = output<void>();
}
