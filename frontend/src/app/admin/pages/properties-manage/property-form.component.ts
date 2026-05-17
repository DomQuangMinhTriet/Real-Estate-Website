import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Chỉnh sửa Bất động sản' : 'Thêm Bất động sản mới' }}</h2>
        <a routerLink="/admin/properties" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          &larr; Quay lại danh sách
        </a>
      </div>

      <div *ngIf="errorMessage" class="mb-4 p-4 bg-rose-50 text-rose-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Thông tin cơ bản -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề Bất động sản *</label>
            <input formControlName="title" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="VD: Căn hộ cao cấp Vinhome...">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ) *</label>
            <input formControlName="price" type="number" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="2500000000">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
            <select formControlName="category_id" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="">-- Chọn danh mục --</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dự án</label>
            <select formControlName="project_id" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="">-- Không thuộc dự án --</option>
              <option *ngFor="let proj of projects" [value]="proj.id">{{ proj.name }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
          <textarea formControlName="description" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Mô tả về tiện ích, vị trí..."></textarea>
        </div>

        <!-- Phần Upload Ảnh (Quan trọng) -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Hình ảnh Bất động sản</h3>
          
          <!-- Nút chọn ảnh -->
          <div class="flex items-center justify-center w-full mb-4">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click để chọn ảnh</span> hoặc kéo thả vào đây</p>
              </div>
              <input type="file" class="hidden" accept="image/*" multiple (change)="onFileSelected($event)" [disabled]="isUploading" />
            </label>
          </div>

          <!-- Thông báo đang tải -->
          <div *ngIf="isUploading" class="text-sm text-indigo-600 font-medium mb-4 animate-pulse flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Đang tải ảnh lên Cloudinary...
          </div>

          <!-- Khu vực Preview Ảnh đã upload -->
          <div *ngIf="uploadedMedia.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div *ngFor="let url of uploadedMedia; let i = index" class="relative group rounded-lg overflow-hidden border">
              <img [src]="url" class="w-full h-24 object-cover" alt="Property image">
              <button type="button" (click)="removeImage(i)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6 border-t gap-3">
          <button type="button" routerLink="/admin/properties" class="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Hủy</button>
          <button type="submit" [disabled]="propertyForm.invalid || isUploading || isSubmitting" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50">
            {{ isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Lưu Bất động sản') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private uploadService = inject(UploadService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  propertyForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    category_id: ['', Validators.required],
    project_id: [''],
    description: [''],
  });

  categories: any[] = [];
  projects: any[] = [];
  uploadedMedia: string[] = []; // Chứa danh sách URL từ Cloudinary
  isUploading = false;
  isSubmitting = false;
  errorMessage = '';
  isEditMode = false;
  propertyId = '';

  ngOnInit() {
    this.api.get<any>('/properties/categories').subscribe({
      next: (res) => this.categories = res.data || [],
      error: () => console.log('Có thể API categories chưa sẵn sàng')
    });
    this.api.get<any>('/projects').subscribe({
      next: (res) => this.projects = res.data || [],
      error: () => console.log('Có thể API projects chưa sẵn sàng')
    });

    // Kiểm tra xem có đang ở chế độ Edit không
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEditMode = true;
      this.api.get<any>(`/properties/${slug}`).subscribe({
        next: (res) => {
          const prop = res.data;
          this.propertyId = prop.id;
          this.propertyForm.patchValue({
            title: prop.title,
            price: prop.price,
            category_id: prop.category_id || '',
            project_id: prop.project_id || '',
            description: prop.description
          });
          if (prop.property_media && prop.property_media.length > 0) {
            this.uploadedMedia = prop.property_media.map((m: any) => m.media_url);
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Không thể tải thông tin Bất động sản.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Xử lý khi user chọn ảnh
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.isUploading = true;
    
    // Lấy file đầu tiên để upload (UploadService hiện tại nhận 1 file)
    const file = files[0];
    this.uploadService.uploadFile(file).subscribe({
      next: (res) => {
        const url = res.data?.url || res.data?.secure_url || res.secure_url || res.url; // Bắt URL từ Cloudinary trả về
        this.uploadedMedia.push(url);
        this.isUploading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi upload:', err);
        this.errorMessage = 'Lỗi khi upload ảnh. Vui lòng thử lại!';
        this.isUploading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeImage(index: number) {
    this.uploadedMedia.splice(index, 1);
  }

  onSubmit() {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Gộp dữ liệu form và mảng link ảnh Cloudinary
    const payload = {
      ...this.propertyForm.value,
      media: this.uploadedMedia
    };

    if (this.isEditMode) {
      this.api.put<any>(`/properties/${this.propertyId}`, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/properties']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Có lỗi xảy ra khi cập nhật Bất động sản.';
        }
      });
    } else {
      this.api.post<any>('/properties', payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/properties']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Có lỗi xảy ra khi lưu Bất động sản.';
        }
      });
    }
  }
}