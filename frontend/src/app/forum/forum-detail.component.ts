import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto mt-8 px-4">
      <div class="mb-6 flex justify-between items-center">
        <a routerLink="/forum" class="text-indigo-600 hover:underline flex items-center gap-1 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại diễn đàn
        </a>
        <button (click)="goHome()" class="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          🏠 Về trang chủ
        </button>
      </div>

      <div *ngIf="isLoading" class="animate-pulse space-y-4 mb-8">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-32 bg-gray-200 rounded w-full"></div>
      </div>

      <div *ngIf="!isLoading && !post" class="text-center py-12 bg-white rounded-xl border border-gray-100">
        <p class="text-gray-500">Không tìm thấy bài viết hoặc bài viết đã bị xóa.</p>
      </div>

      <!-- Chi tiết bài viết -->
      <div *ngIf="!isLoading && post" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ post.title }}</h1>
        <div class="flex items-center text-sm text-gray-500 gap-4 mb-8 border-b border-gray-100 pb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {{ (post.profiles?.full_name || 'U')[0] | uppercase }}
            </div>
            <span class="font-medium text-gray-700">{{ post.profiles?.full_name || 'Thành viên' }}</span>
          </div>
          <span>•</span>
          <span>{{ post.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
        </div>
        
        <div class="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8 text-lg">
          {{ post.content }}
        </div>

        <!-- Tương tác -->
        <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button (click)="toggleReact()" [disabled]="!isLoggedIn || isReacting" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" [ngClass]="hasReacted ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'">
            <svg class="w-5 h-5" [attr.fill]="hasReacted ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            {{ hasReacted ? 'Đã thích' : 'Thích' }}
          </button>
          
          <button *ngIf="isLoggedIn" (click)="showReportForm = !showReportForm" class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Báo cáo
          </button>
        </div>

        <!-- Form Báo cáo -->
        <div *ngIf="showReportForm" class="mt-4 p-4 bg-rose-50 rounded-lg border border-rose-100">
          <h4 class="text-sm font-bold text-rose-800 mb-2">Báo cáo bài viết vi phạm</h4>
          <textarea [(ngModel)]="reportReason" rows="2" placeholder="Lý do báo cáo..." class="w-full px-3 py-2 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none mb-3"></textarea>
          <div class="flex justify-end gap-2">
            <button (click)="showReportForm = false" class="px-3 py-1.5 text-sm text-gray-600 hover:bg-rose-100 rounded-md">Hủy</button>
            <button (click)="submitReport()" [disabled]="!reportReason.trim()" class="px-3 py-1.5 text-sm bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50">Gửi báo cáo</button>
          </div>
        </div>
      </div>

      <!-- Bình luận -->
      <div *ngIf="!isLoading && post" class="mb-12">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Bình luận ({{ comments.length }})</h3>

        <!-- Form bình luận -->
        <div *ngIf="isLoggedIn" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
            <textarea formControlName="content" rows="3" placeholder="Viết bình luận của bạn..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none mb-3"></textarea>
            <div class="flex justify-end">
              <button type="submit" [disabled]="commentForm.invalid || isCommenting" class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {{ isCommenting ? 'Đang gửi...' : 'Gửi bình luận' }}
              </button>
            </div>
          </form>
        </div>
        
        <div *ngIf="!isLoggedIn" class="bg-gray-50 rounded-xl p-6 mb-8 text-center border border-gray-200">
          <a routerLink="/auth/login" class="text-indigo-600 font-medium hover:underline">Đăng nhập</a> để tham gia bình luận.
        </div>

        <!-- Danh sách bình luận -->
        <div class="space-y-4">
          <div *ngFor="let comment of comments" class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold flex-shrink-0">
                {{ (comment.profiles?.full_name || 'U')[0] | uppercase }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-gray-800">{{ comment.profiles?.full_name || 'Thành viên' }}</span>
                  <span class="text-xs text-gray-500">• {{ comment.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForumDetailComponent implements OnInit {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  post: any = null;
  comments: any[] = [];
  isLoading = true;
  isCommenting = false;
  isReacting = false;
  hasReacted = false;
  showReportForm = false;
  reportReason = '';

  commentForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  });

  get isLoggedIn() { return !!this.authService.currentUser; }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPostData(id);
      }
    });
  }

  loadPostData(id: string) {
    this.isLoading = true;
    this.api.get<any>(`/forum/${id}`).subscribe({
      next: (res: any) => {
        this.post = res.data || res;
        this.loadComments(id);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadComments(postId: string) {
    this.api.get<any>(`/forum/${postId}/comments`).subscribe({
      next: (res: any) => {
        this.comments = res.data || (Array.isArray(res) ? res : []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitComment() {
    if (this.commentForm.invalid || !this.post) return;
    this.isCommenting = true;

    this.api.post<any>(`/forum/${this.post.id}/comments`, this.commentForm.value).subscribe({
      next: () => {
        this.isCommenting = false;
        this.commentForm.reset();
        this.loadComments(this.post.id);
      },
      error: (err: any) => {
        this.isCommenting = false;
        alert(err.error?.error || 'Lỗi khi gửi bình luận.');
        this.cdr.detectChanges();
      }
    });
  }

  toggleReact() {
    if (!this.post) return;
    this.isReacting = true;
    this.api.post<any>(`/forum/${this.post.id}/react`, {}).subscribe({
      next: () => {
        this.hasReacted = !this.hasReacted;
        this.isReacting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isReacting = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitReport() {
    if (!this.post || !this.reportReason.trim()) return;
    this.api.post<any>(`/forum/${this.post.id}/report`, { reason: this.reportReason }).subscribe({
      next: () => {
        alert('Cảm ơn bạn đã báo cáo. Ban quản trị sẽ xem xét sớm nhất.');
        this.showReportForm = false;
        this.reportReason = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err.error?.error || 'Lỗi khi gửi báo cáo.');
        this.cdr.detectChanges();
      }
    });
  }

  goHome() {
    const user = this.authService.currentUser;
    if (user && (user.role === 'admin' || user.role === 'agent')) {
      this.router.navigate(['/admin/properties-manage']);
    } else if (user && user.role === 'member') {
      this.router.navigate(['/admin/account-settings']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}