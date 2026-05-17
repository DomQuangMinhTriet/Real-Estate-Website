import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-agent-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Duyệt Yêu Cầu Môi Giới</h2>
        <p class="text-gray-500 text-sm mt-1">Xét duyệt các đơn đăng ký trở thành môi giới từ thành viên.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-semibold">Tài khoản Yêu cầu</th>
              <th class="px-6 py-4 font-semibold">Kinh nghiệm</th>
              <th class="px-6 py-4 font-semibold">Khu vực hoạt động</th>
              <th class="px-6 py-4 font-semibold">Ngày nộp</th>
              <th class="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          
          <tbody *ngIf="isLoading" class="divide-y divide-gray-100">
            <tr *ngFor="let i of [1,2,3]" class="animate-pulse">
              <td class="px-6 py-4" colspan="5"><div class="h-8 bg-gray-200 rounded w-full"></div></td>
            </tr>
          </tbody>

          <tbody *ngIf="!isLoading && requests.length === 0">
            <tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">Hiện không có yêu cầu nào đang chờ duyệt.</td></tr>
          </tbody>

          <tbody *ngIf="!isLoading" class="divide-y divide-gray-100">
            <tr *ngFor="let req of requests" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ req.profiles?.full_name || 'User' }}</p>
                    <p class="text-xs text-gray-500">{{ req.profiles?.phone || 'Chưa cập nhật SĐT' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{ req.request_data?.experience_years }} năm</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ req.request_data?.area }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ req.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button (click)="updateStatus(req.id, 'approved')" class="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded font-medium text-sm transition-colors">Phê duyệt</button>
                  <button (click)="updateStatus(req.id, 'rejected')" class="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded font-medium text-sm transition-colors">Từ chối</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AgentRequestsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  requests: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.api.get<any>('/leads/agent-requests').subscribe({
      next: (res: any) => { 
        this.requests = res.data || (Array.isArray(res) ? res : []); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { console.error('Lỗi tải agent requests:', err); this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  updateStatus(id: string, status: 'approved' | 'rejected') {
    const actionStr = status === 'approved' ? 'Phê duyệt' : 'Từ chối';
    if (confirm(`Bạn có chắc muốn ${actionStr} yêu cầu này?`)) {
      this.api.put<any>(`/leads/agent-requests/${id}/status`, { status }).subscribe({
        next: () => this.loadRequests(),
        error: (err) => alert(`${actionStr} thất bại: ` + (err.error?.error || 'Lỗi hệ thống'))
      });
    }
  }
}