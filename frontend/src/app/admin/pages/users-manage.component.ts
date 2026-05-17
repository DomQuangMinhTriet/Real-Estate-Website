import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-users-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>
        <p class="text-gray-500 text-sm mt-1">Xem danh sách thành viên và thiết lập phân quyền.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-semibold">Người dùng</th>
              <th class="px-6 py-4 font-semibold">Số điện thoại</th>
              <th class="px-6 py-4 font-semibold">Cập nhật lần cuối</th>
              <th class="px-6 py-4 font-semibold text-right">Phân quyền (Role)</th>
            </tr>
          </thead>
          
          <tbody *ngIf="isLoading" class="divide-y divide-gray-100">
            <tr *ngFor="let i of [1,2,3,4]" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-10 bg-gray-200 rounded w-48"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
              <td class="px-6 py-4"><div class="h-8 bg-gray-200 rounded w-32 ml-auto"></div></td>
            </tr>
          </tbody>

          <tbody *ngIf="!isLoading" class="divide-y divide-gray-100">
            <tr *ngFor="let user of users" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img *ngIf="user.avatar_url" [src]="user.avatar_url" class="w-10 h-10 rounded-full object-cover border border-gray-200">
                  <div *ngIf="!user.avatar_url" class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {{ (user.full_name || user.username || 'U').substring(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ user.full_name || user.username || 'Chưa cập nhật' }}</p>
                    <p class="text-xs text-gray-500">{{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.phone || '--' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.updated_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="px-6 py-4 text-right">
                <select [ngModel]="user.role" (ngModelChange)="changeRole(user.id, $event)" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer">
                  <option value="member">Thành viên (Member)</option>
                  <option value="agent">Môi giới (Agent)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersManageComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.get<any>('/profiles').subscribe({
      next: (res: any) => { 
        this.users = res.data || (Array.isArray(res) ? res : []); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { console.error('Lỗi tải users:', err); this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  changeRole(userId: string, newRole: string) {
    if (confirm(`Bạn có chắc muốn đổi quyền người dùng này thành ${newRole.toUpperCase()}?`)) {
      this.api.put<any>(`/profiles/${userId}/role`, { role: newRole }).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert('Đổi quyền thất bại: ' + (err.error?.error || 'Lỗi hệ thống'))
      });
    }
  }
}