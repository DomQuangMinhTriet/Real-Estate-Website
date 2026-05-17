import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Kích hoạt hệ thống Routing
    provideRouter(routes),
    // Kích hoạt tính năng Hydration SSR
    provideClientHydration(withEventReplay()),
    // Kích hoạt HttpClient kèm theo Auth Interceptor
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};