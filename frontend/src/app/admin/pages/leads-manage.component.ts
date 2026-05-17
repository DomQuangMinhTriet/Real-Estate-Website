import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-leads-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý Khách hàng (Leads)</h2>
        <p class="text-gray-500 text-sm mt-1">Theo dõi, cập nhật trạng thái và ghi chú cho khách hàng.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th class="px-6 py-4 font-semibold">Khách hàng</th>
                <th class="px-6 py-4 font-semibold">BĐS Quan tâm</th>
                <th class="px-6 py-4 font-semibold">Ghi chú nội bộ</th>
                <th class="px-6 py-4 font-semibold">Trạng thái</th>
                <th class="px-6 py-4 font-semibold text-right">Lưu</th>
              </tr>
            </thead>
            
            <tbody *ngIf="isLoading" class="divide-y divide-gray-100">
              <tr *ngFor="let i of [1,2,3]" class="animate-pulse">
                <td class="px-6 py-4"><div class="h-10 bg-gray-200 rounded w-full"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                <td class="px-6 py-4"><div class="h-8 bg-gray-200 rounded w-full"></div></td>
                <td class="px-6 py-4"><div class="h-8 bg-gray-200 rounded w-24"></div></td>
                <td class="px-6 py-4"><div class="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
              </tr>
            </tbody>

            <tbody *ngIf="!isLoading && leads.length === 0">
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">Chưa có khách hàng nào.</td>
              </tr>
            </tbody>

            <tbody *ngIf="!isLoading && leads.length > 0" class="divide-y divide-gray-100">
              <tr *ngFor="let lead of leads" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <p class="text-sm font-semibold text-gray-800">{{ lead.customer_name }}</p>
                  <p class="text-xs text-gray-500">{{ lead.customer_phone || 'Không có SĐT' }} | {{ lead.customer_email || 'Không có Email' }}</p>
                  <p class="text-xs text-gray-400 mt-1 italic max-w-xs truncate" [title]="lead.message">"{{ lead.message }}"</p>
                </td>
                <td class="px-6 py-4 text-sm text-indigo-600 font-medium">
                  {{ lead.properties?.title || 'Không rõ/Đã xóa' }}
                </td>
                <td class="px-6 py-4">
                  <textarea [(ngModel)]="lead.notes" rows="2" class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Thêm ghi chú..."></textarea>
                </td>
                <td class="px-6 py-4">
                  <select [(ngModel)]="lead.status" class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-600 outline-none">
                    <option value="new">Mới</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="interested">Đang tư vấn</option>
                    <option value="closed">Đã chốt</option>
                    <option value="lost">Hủy</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="updateLead(lead)" class="px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium text-sm transition-colors">
                    Lưu
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LeadsManageComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  leads: any[] = [];
  isLoading = true;

  ngOnInit() { this.loadLeads(); }
  loadLeads() {
    this.api.get<any>('/leads').subscribe({
      next: (res: any) => { 
        this.leads = res.data || (Array.isArray(res) ? res : []); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { console.error('Lỗi tải leads:', err); this.isLoading = false; this.cdr.detectChanges(); }
    });
  }
  updateLead(lead: any) {
    this.api.put<any>(`/leads/${lead.id}`, { status: lead.status, notes: lead.notes }).subscribe({
      next: () => alert('Cập nhật trạng thái và ghi chú thành công!'),
      error: (err) => alert('Lỗi: ' + (err.error?.error || 'Lỗi hệ thống'))
    });
  }
}