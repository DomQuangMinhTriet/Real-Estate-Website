import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const agentGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Trên môi trường Server (SSR), cho phép đi qua để tránh bị redirect sai lệch do không có localStorage
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (isPlatformBrowser(platformId)) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin' || user.role === 'agent') {
        return true;
      }
    }
  }
  
  return router.parseUrl('/auth/login');
};