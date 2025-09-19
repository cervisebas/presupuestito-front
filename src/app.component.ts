import { LoadingService } from '@/common/services/loading';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ProgressSpinnerModule],
  template: `
    <router-outlet />

    @if (loading) {
      <div
        class="fixed top-0 left-0 size-full flex justify-center items-center bg-white/60 z-[999999]"
      >
        <p-progress-spinner strokeWidth="4" ariaLabel="Cargando" />
      </div>
    }
  `,
})
export class AppComponent {
  constructor(private loadingService: LoadingService) {}

  protected get loading() {
    return this.loadingService.loading;
  }
}
