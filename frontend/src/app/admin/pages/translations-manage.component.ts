import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-translations-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý Dịch thuật (Đa ngôn ngữ)</h2>
        <p class="text-gray-500 text-sm mt-1">Đối chiếu, chỉnh sửa và phê duyệt các bản dịch do máy tạo ra.</p>
      </div>

      <div *ngIf="isLoading" class="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
      <div *ngIf="!isLoading && translations.length === 0" class="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
        Không có bản dịch nào đang chờ duyệt.
      </div>

      <div class="space-y-6">
        <div *ngFor="let item of translations" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
            <div>
              <span class="font-bold text-gray-700 uppercase tracking-wider text-sm">{{ item.entity_type }}</span>
              <span class="text-xs text-gray-400 ml-2">ID: {{ item.entity_id }}</span>
            </div>
            <span class="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded text-xs">Ngôn ngữ: {{ item.lang_code | uppercase }}</span>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cột Dữ liệu (Key-Value) -->
            <div class="col-span-2">
              <div *ngFor="let key of getKeys(item.translation_data)" class="mb-4">
                <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Trường: {{ key }}</label>
                <textarea [(ngModel)]="item.translation_data[key]" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none" [class.border-indigo-300]="true"></textarea>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button (click)="saveAndApprove(item)" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              Lưu & Phê duyệt hiển thị
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TranslationsManageComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  translations: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.isLoading = true;
    this.api.get<any>('/translations/pending').subscribe({
      next: (res: any) => { 
        this.translations = res.data || (Array.isArray(res) ? res : []); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { 
        console.error('Lỗi tải translations:', err); 
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      }
    });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  saveAndApprove(item: any) {
    // Cập nhật lại bản dịch
    this.api.put<any>(`/translations/${item.id}`, { translation_data: item.translation_data }).subscribe({
      next: () => {
        // Sau đó phê duyệt hiển thị
        this.api.put<any>(`/translations/${item.id}/approve`, {}).subscribe({
          next: () => {
            alert('Đã phê duyệt bản dịch thành công!');
            this.loadPending();
          },
          error: (err) => alert('Lỗi duyệt: ' + (err.error?.error || 'Unknown'))
        });
      },
      error: (err) => {
        alert('Lỗi lưu bản dịch: ' + (err.error?.error || 'Unknown'));
      }
    });
  }
}