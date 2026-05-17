import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { CustomValidators } from '../shared/validators/custom.validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Tạo mật khẩu mới</h2>
        
        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm flex flex-col items-center">
          <p class="mb-3">{{ successMessage }}</p>
          <a routerLink="/auth/login" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-center w-full">Đi tới Đăng nhập</a>
        </div>

        <form *ngIf="!successMessage" [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Mật khẩu mới</label>
            <input formControlName="password" id="password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="Ít nhất 6 ký tự">
            <p *ngIf="resetForm.get('password')?.invalid && resetForm.get('password')?.touched" class="text-red-500 text-xs italic mt-1">Mật khẩu phải từ 6 ký tự trở lên.</p>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm_password">Xác nhận mật khẩu mới</label>
            <input formControlName="confirm_password" id="confirm_password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="Nhập lại mật khẩu mới">
            <p *ngIf="resetForm.get('confirm_password')?.errors?.['passwordMismatch'] && resetForm.get('confirm_password')?.touched" class="text-red-500 text-xs italic mt-1">Mật khẩu xác nhận không khớp.</p>
          </div>

          <div class="mb-4">
            <button [disabled]="resetForm.invalid || isLoading" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full transition-colors" type="submit">
              {{ isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', Validators.required]
  }, {
    validators: [CustomValidators.matchPassword('password', 'confirm_password')]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    // Bắt token từ URL (Query Param: ?token=xxx hoặc Hash fragment từ Supabase: #access_token=xxx)
    this.route.queryParams.subscribe(params => {
      if (params['token'] && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('access_token', params['token']);
      }
    });
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const urlParams = new URLSearchParams(fragment);
        const token = urlParams.get('access_token');
        if (token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', token);
        }
      }
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.authService.resetPassword(this.resetForm.value.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Cập nhật mật khẩu thành công!';
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('access_token');
        }
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Không thể đổi mật khẩu. Link khôi phục có thể đã hết hạn.';
        this.cdr.detectChanges();
      }
    });
  }
}