import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-screen w-64 bg-gray-800 text-white flex flex-col fixed left-0 top-0 shadow-lg z-50">
      <div class="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>
      <nav class="flex-1 overflow-y-auto p-4 space-y-2">
        <!-- Lối đi tắt ra Diễn Đàn Public -->
        <a routerLink="/forum" class="block px-4 py-2 text-indigo-300 rounded hover:bg-gray-700 font-bold mb-4">🌐 Xem Diễn đàn Public</a>

        <!-- Menu chung cho Agent & Admin -->
        <a routerLink="/admin/dashboard" class="block px-4 py-2 rounded hover:bg-gray-700"> Trang chủ</a>
        <a routerLink="/admin/properties" class="block px-4 py-2 rounded hover:bg-gray-700"> 🏠 Quản lý BĐS</a>
        <a routerLink="/admin/leads" class="block px-4 py-2 rounded hover:bg-gray-700">👥 Quản lý Khách hàng</a>
        <a routerLink="/admin/blogs-manage" class="block px-4 py-2 rounded hover:bg-gray-700">✍️ Quản lý Blog & Tin tức</a>
        <a routerLink="/admin/account-settings" class="block px-4 py-2 rounded hover:bg-gray-700">⚙️ Cài đặt tài khoản</a>

        <!-- Khu vực chỉ dành cho Admin (Sử dụng ngIf để ẩn với Agent) -->
        <ng-container *ngIf="isAdmin">
          <div class="mt-6 mb-2 text-xs text-gray-400 uppercase tracking-wider px-4">Quyền Quản Trị</div>
          <a routerLink="/admin/projects" class="block px-4 py-2 rounded hover:bg-gray-700">🏢 Dự án & Danh mục</a>
          <a routerLink="/admin/users" class="block px-4 py-2 rounded hover:bg-gray-700">🧑‍💻 Quản lý User</a>
          <a routerLink="/admin/agent-requests" class="block px-4 py-2 rounded hover:bg-gray-700">📝 Yêu cầu Môi giới</a>
          <a routerLink="/admin/forum-approval" class="block px-4 py-2 rounded hover:bg-gray-700">⚖️ Duyệt Diễn Đàn</a>
          <a routerLink="/admin/translations-manage" class="block px-4 py-2 rounded hover:bg-gray-700">🌐 Dịch thuật</a>
          <a routerLink="/admin/system-logs" class="block px-4 py-2 rounded hover:bg-gray-700">📜 Nhật ký hệ thống</a>
        </ng-container>
      </nav>
    </div>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isAdmin() {
    return this.authService.currentUser?.role === 'admin';
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}