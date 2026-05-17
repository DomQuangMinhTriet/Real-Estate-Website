import { Component, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Quên mật khẩu?</h2>
        <p class="text-sm text-center text-gray-600 mb-6">Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>
        
        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">
          {{ successMessage }}
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
            <input formControlName="email" id="email" type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="Nhập email của bạn">
            <p *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched" class="text-red-500 text-xs italic mt-1">Vui lòng nhập một email hợp lệ.</p>
          </div>

          <div class="mb-4">
            <button [disabled]="forgotForm.invalid || isLoading || countdown > 0" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full transition-colors" type="submit">
              <ng-container *ngIf="isLoading">Đang gửi yêu cầu...</ng-container>
              <ng-container *ngIf="!isLoading && countdown === 0">Gửi liên kết khôi phục</ng-container>
              <ng-container *ngIf="!isLoading && countdown > 0">Gửi lại sau {{ countdown }}s</ng-container>
            </button>
          </div>
          
          <div class="text-center text-sm text-gray-600">
            <a routerLink="/auth/login" class="text-blue-600 font-semibold hover:underline">Quay lại đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  countdown = 0;
  private countdownSub?: Subscription;

  onSubmit() {
    if (this.forgotForm.invalid || this.countdown > 0) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (kể cả thư mục Spam)!';
        this.startCountdown(60);
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Không thể gửi yêu cầu. Có thể email này chưa được đăng ký.';
        this.cdr.detectChanges();
      }
    });
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    if (this.countdownSub) this.countdownSub.unsubscribe();
    
    this.countdownSub = timer(1000, 1000).pipe(take(seconds)).subscribe({
      next: () => {
        this.countdown--;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.countdown = 0;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }
}