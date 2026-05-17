import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-categories-projects-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-6xl mx-auto mt-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý Danh mục & Dự án</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cột Danh mục -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Danh mục Bất động sản</h3>
          
          <form [formGroup]="catForm" (ngSubmit)="addCategory()" class="flex gap-2 mb-6">
            <input formControlName="name" type="text" placeholder="Tên danh mục mới (VD: Căn hộ)" class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none">
            <button type="submit" [disabled]="catForm.invalid || isAddingCat" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">Thêm</button>
          </form>

          <ul class="divide-y divide-gray-100">
            <li *ngFor="let cat of categories" class="py-3 flex justify-between items-center group">
              <div>
                <p class="font-medium text-gray-800">{{ cat.name }}</p>
                <p class="text-xs text-gray-500 font-mono">Slug: {{ cat.slug }}</p>
              </div>
              <button (click)="deleteCategory(cat.id)" class="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity">Xóa</button>
            </li>
          </ul>
        </div>

        <!-- Cột Dự án -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Quản lý Dự án & Theme</h3>
          
          <form [formGroup]="projForm" (ngSubmit)="addProject()" class="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input formControlName="name" type="text" placeholder="Tên dự án" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none">
            <select formControlName="theme_id" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="minimalist">Theme: Minimalist (Nhà phố)</option>
              <option value="luxury">Theme: Luxury (Căn hộ cao cấp)</option>
              <option value="eco-green">Theme: Eco Green (Sinh thái)</option>
            </select>
            <textarea formControlName="description" placeholder="Mô tả dự án..." rows="2" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"></textarea>
            <button type="submit" [disabled]="projForm.invalid || isAddingProj" class="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">Tạo Dự án Mới</button>
          </form>

          <ul class="divide-y divide-gray-100">
            <li *ngFor="let proj of projects" class="py-3 flex justify-between items-center group">
              <div>
                <p class="font-medium text-gray-800">{{ proj.name }}</p>
                <p class="text-xs text-gray-500">Theme: <span class="uppercase text-indigo-600 font-semibold tracking-wider">{{ proj.theme_id }}</span></p>
              </div>
              <button (click)="deleteProject(proj.id)" class="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity">Xóa</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class CategoriesProjectsManageComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  categories: any[] = [];
  projects: any[] = [];
  
  catForm: FormGroup = this.fb.group({ name: ['', Validators.required] });
  projForm: FormGroup = this.fb.group({ 
    name: ['', Validators.required], 
    theme_id: ['minimalist', Validators.required],
    description: ['']
  });

  isAddingCat = false;
  isAddingProj = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.get<any>('/properties/categories').subscribe({
      next: (res: any) => { this.categories = res.data; this.cdr.detectChanges(); }
    });
    this.api.get<any>('/projects').subscribe({
      next: (res: any) => { this.projects = res.data; this.cdr.detectChanges(); }
    });
  }

  addCategory() {
    if (this.catForm.invalid) return;
    this.isAddingCat = true;
    this.api.post<any>('/properties/categories', this.catForm.value).subscribe({
      next: () => {
        this.catForm.reset(); this.isAddingCat = false; this.loadData();
      },
      error: () => { this.isAddingCat = false; }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Xóa danh mục này?')) {
      this.api.delete<any>(`/properties/categories/${id}`).subscribe({ next: () => this.loadData() });
    }
  }

  addProject() {
    if (this.projForm.invalid) return;
    this.isAddingProj = true;
    this.api.post<any>('/projects', this.projForm.value).subscribe({
      next: () => {
        this.projForm.reset({ theme_id: 'minimalist' }); this.isAddingProj = false; this.loadData();
      },
      error: () => { this.isAddingProj = false; }
    });
  }

  deleteProject(id: string) {
    if (confirm('Xóa dự án này?')) {
      this.api.delete<any>(`/projects/${id}`).subscribe({ next: () => this.loadData() });
    }
  }
}