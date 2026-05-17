import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-properties-manage',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto mt-4">
      
      <!-- GIAO DIỆN DANH SÁCH (Ẩn khi đang mở Form) -->
      <div *ngIf="!isFormVisible">
        <!-- Tiêu đề & Nút thêm mới -->
        <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Danh sách Bất động sản</h2>
          <p class="text-gray-500 text-sm mt-1">Quản lý tất cả bất động sản trong hệ thống.</p>
        </div>
          <button (click)="openCreateForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Thêm Bất động sản
          </button>
        </div>

        <!-- Bảng dữ liệu -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-semibold">Bất động sản</th>
                  <th class="px-6 py-4 font-semibold">Dự án & Danh mục</th>
                  <th class="px-6 py-4 font-semibold">Giá (VNĐ)</th>
                  <th class="px-6 py-4 font-semibold">Trạng thái</th>
                  <th class="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              
              <!-- Skeleton Loading -->
              <tbody *ngIf="isLoading" class="divide-y divide-gray-100">
                <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
                  <td class="px-6 py-4"><div class="h-10 bg-gray-200 rounded w-full"></div></td>
                  <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td class="px-6 py-4"><div class="h-6 bg-gray-200 rounded-full w-16"></div></td>
                  <td class="px-6 py-4"><div class="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
                </tr>
              </tbody>

              <!-- Hiển thị khi không có dữ liệu -->
              <tbody *ngIf="!isLoading && properties.length === 0">
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    Chưa có bất động sản nào. Hãy thêm mới ngay!
                  </td>
                </tr>
              </tbody>

              <!-- Hiển thị dữ liệu thực -->
              <tbody *ngIf="!isLoading && properties.length > 0" class="divide-y divide-gray-100">
                <tr *ngFor="let prop of properties" class="hover:bg-gray-50 transition-colors">
                  
                  <!-- Cột Hình ảnh & Tiêu đề -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <div class="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                        <img *ngIf="prop.property_media && prop.property_media.length > 0" 
                             [src]="prop.property_media[0].media_url" 
                             class="w-full h-full object-cover">
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-800 line-clamp-1" [title]="prop.title">{{ prop.title }}</p>
                        <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ prop.slug }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Cột Dự án & Danh mục -->
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-800 font-medium">{{ prop.projects?.name || 'Không thuộc dự án' }}</p>
                    <p class="text-xs text-indigo-600 mt-0.5 font-semibold">{{ prop.categories?.name || '' }}</p>
                  </td>

                  <!-- Cột Giá -->
                  <td class="px-6 py-4">
                    <span class="text-sm font-bold text-gray-800">{{ prop.price | number:'1.0-0' }}</span>
                  </td>

                  <!-- Cột Trạng thái -->
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {{ prop.status === 'available' ? 'Đang bán' : prop.status }}
                    </span>
                  </td>

                  <!-- Cột Thao tác -->
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-3">
                      <button (click)="openEditForm(prop)" class="text-blue-500 hover:text-blue-700 transition-colors" title="Chỉnh sửa">
                        Sửa
                      </button>
                      <button (click)="deleteProperty(prop.id)" class="text-red-500 hover:text-red-700 transition-colors" title="Xóa">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- GIAO DIỆN FORM (Thêm/Sửa) -->
      <div *ngIf="isFormVisible" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditMode ? 'Chỉnh sửa Bất động sản' : 'Thêm Bất động sản mới' }}</h3>
          <button (click)="closeForm()" class="text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form [formGroup]="propertyForm" (ngSubmit)="onSubmitForm()" class="p-6">
          <!-- Thông tin cơ bản -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
              <input type="text" formControlName="title" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: Căn hộ cao cấp ven hồ">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mức giá (VNĐ) *</label>
              <input type="number" formControlName="price" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 2500000000">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
              <select formControlName="category_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                <option [ngValue]="null">-- Chọn danh mục --</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dự án (Tùy chọn)</label>
              <select formControlName="project_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                <option [ngValue]="null">-- Không thuộc dự án --</option>
                <option *ngFor="let proj of projects" [ngValue]="proj.id">{{ proj.name }}</option>
              </select>
            </div>
            
            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
              <textarea formControlName="description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Nhập mô tả về bất động sản..."></textarea>
            </div>
          </div>

          <!-- Nhóm Thông số chi tiết (JSONB) -->
          <div formGroupName="attributes" class="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
            <h4 class="text-md font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Thông số chi tiết (Mở rộng JSONB)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                <input type="number" formControlName="area" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 100">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số tầng</label>
                <input type="number" formControlName="floors" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phòng ngủ</label>
                <input type="number" formControlName="bedrooms" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 3">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phòng tắm</label>
                <input type="number" formControlName="bathrooms" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hướng cửa</label>
                <select formControlName="direction" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">-- Chọn hướng --</option>
                  <option value="Đông">Đông</option>
                  <option value="Tây">Tây</option>
                  <option value="Nam">Nam</option>
                  <option value="Bắc">Bắc</option>
                  <option value="Đông Nam">Đông Nam</option>
                  <option value="Tây Bắc">Tây Bắc</option>
                  <option value="Đông Bắc">Đông Bắc</option>
                  <option value="Tây Nam">Tây Nam</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Upload hình ảnh (Drag & Drop) -->
          <div class="mb-6">
            <h4 class="text-md font-semibold text-gray-700 mb-2">Hình ảnh Bất động sản</h4>
            
            <!-- Khu vực kéo thả -->
            <div 
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors"
              (dragover)="onDragOver($event)" 
              (drop)="onDrop($event)"
              (click)="fileInput.click()"
              [class.bg-gray-100]="isUploading">
              
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4 flex justify-center text-sm text-gray-600">
                <span class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Tải ảnh lên</span>
                  <input #fileInput type="file" multiple accept="image/*" class="sr-only" (change)="onFileSelected($event)">
                </span>
                <p class="pl-1">hoặc kéo thả vào đây</p>
              </div>
              <p class="text-xs text-gray-500 mt-2">PNG, JPG, JPEG lên đến 5MB</p>
              <p *ngIf="isUploading" class="text-sm text-indigo-600 font-medium mt-2 animate-pulse">Đang tải ảnh lên Cloudinary...</p>
            </div>

            <!-- Preview ảnh đã upload -->
            <div *ngIf="uploadedMedia.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              <div *ngFor="let url of uploadedMedia; let i = index" class="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm h-24 w-full">
                <img [src]="url" class="object-cover w-full h-full">
                <button type="button" (click)="removeMedia(i); $event.stopPropagation()" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <span *ngIf="i === 0" class="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-[10px] text-center py-1 font-medium">Ảnh bìa</span>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button type="button" (click)="closeForm()" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" [disabled]="propertyForm.invalid || isSaving || isUploading" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isSaving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Lưu Bất động sản') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PropertiesManageComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  properties: any[] = [];
  meta: any = null;
  isLoading = true;

  // State Form
  isFormVisible = false;
  isEditMode = false;
  currentEditingId: string | null = null;
  isSaving = false;
  
  // Data phụ trợ
  categories: any[] = [];
  projects: any[] = [];
  
  // Upload Media
  uploadedMedia: string[] = [];
  isUploading = false;

  // Reactive Form BĐS
  propertyForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    description: [''],
    category_id: [null, Validators.required],
    project_id: [null],
    attributes: this.fb.group({
      area: [null],
      floors: [null],
      bedrooms: [null],
      bathrooms: [null],
      direction: ['']
    })
  });

  ngOnInit() {
    this.loadProperties();
    this.loadDependencies();
  }

  loadDependencies() {
    this.api.get<any>('/properties/categories').subscribe({
      next: (res) => { this.categories = res.data || []; this.cdr.detectChanges(); }
    });
    this.api.get<any>('/projects').subscribe({
      next: (res) => { this.projects = res.data || []; this.cdr.detectChanges(); }
    });
  }

  loadProperties(page: number = 1) {
    this.isLoading = true;
    // Gọi API kèm query params manage=true để báo backend ta đang xem bằng quyền quản trị
    this.api.get<any>('/properties', { manage: true, page, limit: 10 }).subscribe({
      next: (res) => {
        this.properties = res.data || [];
        this.meta = res.meta;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ép Angular cập nhật dữ liệu DOM
      },
      error: (err) => {
        console.error('Lỗi tải danh sách BĐS:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteProperty(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa Bất động sản này? (Đưa vào thùng rác)')) {
      this.api.delete<any>(`/properties/${id}`).subscribe({
        next: () => {
          alert('Đã xóa Bất động sản thành công.');
          this.loadProperties(this.meta?.page || 1);
        },
        error: (err) => alert('Lỗi xóa Bất động sản. Vui lòng thử lại.')
      });
    }
  }

  // --- XỬ LÝ FORM ---
  openCreateForm() {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.currentEditingId = null;
    this.propertyForm.reset({ attributes: { direction: '' } });
    this.uploadedMedia = [];
  }

  openEditForm(prop: any) {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentEditingId = prop.id;
    this.uploadedMedia = prop.property_media?.map((m: any) => m.media_url) || [];
    
    this.propertyForm.patchValue({
      title: prop.title,
      price: prop.price,
      description: prop.description,
      category_id: prop.category_id,
      project_id: prop.project_id,
      attributes: prop.attributes || {}
    });
  }

  closeForm() {
    this.isFormVisible = false;
  }

  onSubmitForm() {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }
    
    this.isSaving = true;
    this.cdr.detectChanges();

    const payload = {
      ...this.propertyForm.value,
      media: this.uploadedMedia
    };

    if (this.isEditMode && this.currentEditingId) {
      this.api.put<any>(`/properties/${this.currentEditingId}`, payload).subscribe({
        next: () => {
          alert('Cập nhật Bất động sản thành công!');
          this.isSaving = false;
          this.closeForm();
          this.loadProperties(this.meta?.page || 1);
        },
        error: (err) => {
          alert('Lỗi khi cập nhật Bất động sản.');
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.api.post<any>('/properties', payload).subscribe({
        next: () => {
          alert('Thêm mới Bất động sản thành công!');
          this.isSaving = false;
          this.closeForm();
          this.loadProperties(1);
        },
        error: (err) => {
          alert('Lỗi khi thêm mới Bất động sản.');
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // --- XỬ LÝ UPLOAD KÉO THẢ ---
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.uploadFiles(files);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) this.uploadFiles(files);
  }

  uploadFiles(files: FileList) {
    this.isUploading = true;
    this.cdr.detectChanges();

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      this.api.post<any>('/upload', formData).subscribe({
        next: (res) => {
          this.uploadedMedia.push(res.data.url);
          this.isUploading = false;
          this.cdr.detectChanges();
        },
        error: (err) => { console.error('Lỗi upload', err); this.isUploading = false; this.cdr.detectChanges(); }
      });
    });
  }

  removeMedia(index: number) {
    this.uploadedMedia.splice(index, 1);
  }
}