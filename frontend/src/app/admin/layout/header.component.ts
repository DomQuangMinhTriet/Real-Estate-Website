import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm z-10 py-4 px-6 flex items-center justify-between">
      <div class="flex items-center">
        <button class="md:hidden text-gray-500 hover:text-indigo-600 focus:outline-none mr-4">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800 hidden sm:block">
          Chào mừng trở lại, {{ userName }}!
        </h2>
      </div>

      <div class="flex items-center space-x-4">
        <button class="text-gray-500 hover:text-indigo-600 transition-colors relative p-2 rounded-full hover:bg-gray-100">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div class="h-6 w-px bg-gray-300"></div>
        <button (click)="logout()" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium text-sm hidden md:block">Đăng xuất</span>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  get userName() { const u = this.authService.currentUser; return u?.full_name || u?.username || u?.email || 'User'; }
  logout() { if (confirm('Bạn có chắc chắn muốn đăng xuất?')) this.authService.logout().subscribe(); }
}