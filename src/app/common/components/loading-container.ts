import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  standalone: true,
  selector: 'app-loading-container',
  imports: [ProgressSpinnerModule],
  template: `
    @if (loading) {
      <div class="w-full h-[90dvh] flex justify-center items-center">
        <p-progress-spinner ariaLabel="loading" />
      </div>
    } @else if (error) {
      <div
        class="w-full h-[90dvh] flex justify-center items-center flex-col gap-6"
      >
        <i class="pi pi-globe !text-5xl"></i>

        <span class="text-xl font-normal">
          Ocurrio un error al cargar el contenido
        </span>
      </div>
    } @else {
      <ng-content />
    }
  `,
  styles: `
    :host {
      width: 100%;
    }
  `,
})
export class LoadingContainer {
  @Input()
  public loading = true;

  @Input()
  public error: any = null;
}
