import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Nhật ký Hệ thống (System Logs)</h2>
        <p class="text-gray-500 text-sm mt-1">Theo dõi các hoạt động quan trọng của người dùng và quản trị viên.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th class="px-6 py-4 font-semibold">Thời gian</th>
                <th class="px-6 py-4 font-semibold">Tài khoản</th>
                <th class="px-6 py-4 font-semibold">Hành động</th>
                <th class="px-6 py-4 font-semibold">Chi tiết</th>
              </tr>
            </thead>
            
            <tbody *ngIf="isLoading" class="divide-y divide-gray-100">
              <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-48"></div></td>
                <td class="px-6 py-4"><div class="h-6 bg-gray-200 rounded-full w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-full"></div></td>
              </tr>
            </tbody>

            <tbody *ngIf="!isLoading && logs.length === 0">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">Chưa có dữ liệu nhật ký nào.</td>
              </tr>
            </tbody>

            <tbody *ngIf="!isLoading && logs.length > 0" class="divide-y divide-gray-100 text-sm">
              <tr *ngFor="let log of logs" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {{ log.created_at | date:'dd/MM/yyyy HH:mm:ss' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ log.profiles?.full_name || log.profiles?.username || 'Hệ thống' }}</span>
                    <span class="text-xs text-gray-400">({{ log.profiles?.role || 'N/A' }})</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-md border" [ngClass]="getActionClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ log.details }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class SystemLogsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  logs: any[] = [];
  isLoading = true;

  ngOnInit() { this.loadLogs(); }
  loadLogs() {
    this.api.get<any>('/logs').subscribe({
      next: (res: any) => { 
        this.logs = res.data || (Array.isArray(res) ? res : []); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { console.error('Lỗi tải logs:', err); this.isLoading = false; this.cdr.detectChanges(); }
    });
  }
  getActionClass(action: string): string {
    if (action.includes('CREATE') || action.includes('INSERT')) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (action.includes('UPDATE')) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (action.includes('DELETE')) return 'bg-rose-50 text-rose-600 border-rose-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}