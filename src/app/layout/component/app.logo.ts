import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-logo',
  imports: [NgClass],
  template: `
    <a [ngClass]="['layout-topbar-logo items-center inline-flex', styleClass]">
      <img src="assets/presupuestito-icono.png" class="h-[3rem]" alt="Icono" />
      <span class="text-yellow-950">PRESUPUESTITO</span>
    </a>
  `,
})
export class AppLogo {
  @Input()
  public styleClass = '';
}
