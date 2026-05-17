import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        </div>
        
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {{ successMessage }}
        </div>

        <form *ngIf="!successMessage" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-4">
              <input formControlName="full_name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Họ và tên">
            </div>
            <div class="mb-4">
              <input formControlName="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Địa chỉ Email">
            </div>
            <div class="mb-4">
              <input formControlName="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Mật khẩu">
            </div>
            <div>
              <input formControlName="confirm_password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Xác nhận mật khẩu">
            </div>
          </div>

          <div *ngIf="registerForm.errors?.['mismatch']" class="text-red-500 text-xs mt-1">Mật khẩu xác nhận không khớp.</div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid || isLoading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
            </button>
          </div>
          <div class="text-sm text-center">
            <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">Đã có tài khoản? Đăng nhập ngay</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerForm: FormGroup = this.fb.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirm_password')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges(); // Ép UI cập nhật trạng thái Loading

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Đăng ký thành công! Đang tự động chuyển hướng đến trang đăng nhập...';
        this.registerForm.reset();
        this.cdr.detectChanges(); // Ép UI hiện màu xanh thành công

        // Chờ 3 giây để người dùng đọc thông báo rồi tự động redirect
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        // Kiểm tra lỗi trùng email từ API
        if (err.status === 400 || err.error?.message?.includes('registered')) {
          this.errorMessage = 'Email này đã được đăng ký hoặc không hợp lệ.';
        } else {
          this.errorMessage = err.error?.error || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.';
        }
        this.cdr.detectChanges(); // Ép UI hiện màu đỏ báo lỗi
      }
    });
  }
}