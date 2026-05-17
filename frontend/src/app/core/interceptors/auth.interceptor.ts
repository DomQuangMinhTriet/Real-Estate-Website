import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  let token = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('access_token');
    // Xóa dấu ngoặc kép thừa nếu vô tình bị lưu dưới dạng JSON string
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
  }
  
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Nếu token hết hạn hoặc không hợp lệ, xóa dữ liệu và đưa về trang đăng nhập
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login'; // Ép tải lại trang để xóa sạch cache bộ nhớ của AuthService
          return throwError(() => error);
        }
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};