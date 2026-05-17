import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-blog-manage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Quản lý Blog & Tin tức</h2>
          <p class="text-sm text-gray-500 mt-1">Nơi {{ isAdmin ? 'duyệt và quản lý toàn bộ' : 'bạn tạo' }} bài viết marketing cho các Dự án/Bất động sản.</p>
        </div>
        <a routerLink="/admin/blogs-manage/create" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
          + Viết Blog mới
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-sm font-semibold text-gray-600">Tiêu đề</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Tác giả</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Trạng thái</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
              <th class="p-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let blog of blogs" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="p-4 font-bold text-gray-800">{{ blog.title }}</td>
              <td class="p-4 text-sm text-gray-700">{{ blog.profiles?.full_name || 'Ẩn danh' }}</td>
              <td class="p-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                  [ngClass]="{'bg-emerald-100 text-emerald-800': blog.status === 'published', 'bg-amber-100 text-amber-800': blog.status === 'pending', 'bg-gray-100 text-gray-800': blog.status === 'draft'}">
                  {{ blog.status === 'published' ? 'Đã xuất bản' : (blog.status === 'pending' ? 'Chờ duyệt' : 'Bản nháp') }}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-500">{{ blog.created_at | date:'dd/MM/yyyy' }}</td>
              <td class="p-4 text-right space-x-2">
                <button *ngIf="isAdmin && blog.status === 'pending'" (click)="updateStatus(blog.id, 'published')" class="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600">Duyệt</button>
                <a [routerLink]="['/admin/blogs-manage/edit', blog.id]" class="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">Sửa</a>
                <button (click)="deleteBlog(blog.id)" class="px-3 py-1 bg-rose-100 text-rose-600 text-xs rounded hover:bg-rose-200">Xóa</button>
              </td>
            </tr>
            <tr *ngIf="blogs.length === 0"><td colspan="5" class="p-8 text-center text-gray-500">Chưa có bài blog nào.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BlogManageComponent implements OnInit {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  blogs: any[] = [];
  get isAdmin() { return this.authService.currentUser?.role === 'admin'; }

  ngOnInit() { this.loadBlogs(); }
  loadBlogs() {
    this.api.get<any>('/blogs/manage').subscribe({ 
      next: (res: any) => { 
        this.blogs = res.data || []; 
        this.cdr.detectChanges(); // Ép Angular cập nhật bảng danh sách ngay lập tức
      } 
    });
  }
  updateStatus(id: string, status: string) {
    this.api.put<any>(`/blogs/${id}/approve`, { status }).subscribe({
      next: () => { alert('Đã duyệt bài!'); this.loadBlogs(); },
      error: (err: any) => { alert(err.error?.error || 'Lỗi duyệt bài'); this.cdr.detectChanges(); }
    });
  }
  deleteBlog(id: string) {
    if(!confirm('Bạn có muốn xóa blog này?')) return;
    this.api.delete<any>(`/blogs/${id}`).subscribe({
      next: () => { alert('Đã xóa bài viết thành công'); this.loadBlogs(); },
      error: (err: any) => { alert(err.error?.error || 'Lỗi khi xóa bài viết'); this.cdr.detectChanges(); }
    });
  }
}