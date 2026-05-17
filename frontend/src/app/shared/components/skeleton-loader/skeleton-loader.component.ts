import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="getClasses()" [ngStyle]="getStyles()"></div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SkeletonLoaderComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() shape: 'circle' | 'rect' | 'square' = 'rect';
  @Input() rounded: string = 'rounded-md';

  getClasses(): string {
    let classes = 'bg-gray-200 animate-pulse w-full h-full ';
    if (this.shape === 'circle') {
      classes += 'rounded-full ';
    } else if (this.shape === 'rect') {
      classes += this.rounded + ' ';
    }
    return classes;
  }

  getStyles(): any {
    return {
      'width': this.width,
      'height': this.height,
      'aspect-ratio': this.shape === 'square' ? '1 / 1' : 'auto'
    };
  }
}