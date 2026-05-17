import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // Khung xương render toàn bộ ứng dụng dựa theo URL
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}