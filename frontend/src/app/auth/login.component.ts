import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>
        
        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
            <input formControlName="email" id="email" type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="Nhập email của bạn">
            <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-red-500 text-xs italic mt-1">Email không hợp lệ.</p>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Mật khẩu</label>
            <input formControlName="password" id="password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="******************">
            <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-red-500 text-xs italic mt-1">Vui lòng nhập mật khẩu (từ 6 ký tự).</p>
          </div>

          <div class="flex items-center justify-between mb-4">
            <button [disabled]="loginForm.invalid || isLoading" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full transition-colors" type="submit">
              {{ isLoading ? 'Đang xác thực...' : 'Đăng nhập' }}
            </button>
          </div>
          
          <div class="text-center text-sm text-gray-600 flex justify-between">
            <a routerLink="/auth/forgot-password" class="hover:text-blue-600 hover:underline">Quên mật khẩu?</a>
            <span>Chưa có tài khoản? <a routerLink="/auth/register" class="text-blue-600 font-semibold hover:underline">Đăng ký</a></span>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    const user = this.authService.currentUser;
    if (user) {
      if (user.role === 'admin' || user.role === 'agent') {
        this.router.navigate(['/admin/dashboard']);
      }
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
        next: () => {
        this.isLoading = false;
          
          const user = this.authService.currentUser;
          const role = user?.role;
          
        if (role === 'admin' || role === 'agent') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']); // Về trang chủ nếu là khách
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
      }
    });
  }
}