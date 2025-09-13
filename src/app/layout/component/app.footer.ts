import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `
    <div class="layout-footer">
      Presupuestito by
      <a href="https://www.isft194.edu.ar/g" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline"> ISFT 194 </a>
    </div>
  `,
})
export class AppFooter {}
