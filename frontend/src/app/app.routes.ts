import { Routes } from '@angular/router';
import { agentGuard } from './core/guards/agent.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login.component').then(c => c.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/register.component').then(c => c.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password.component').then(c => c.ForgotPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./auth/reset-password.component').then(c => c.ResetPasswordComponent) },
      // Nếu người dùng chỉ gõ /auth, tự động đẩy về /auth/login
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [agentGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'forum',
    loadComponent: () => import('./forum/forum-list.component').then(m => m.ForumListComponent)
  },
  {
    path: 'forum/:id',
    loadComponent: () => import('./forum/forum-detail.component').then(m => m.ForumDetailComponent)
  },
  // Redirect trang chủ về thẳng trang login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  // Bắt các route không tồn tại (404 Error) và đẩy về login
  { path: '**', redirectTo: 'auth/login' }
];