import { Component, OnInit } from '@angular/core';
import { Stats } from '@/common/api/services/stats';
import { StatsResponse } from '@/common/api/interfaces/responses/StatsResponse';
import { LoadingContainer } from '@/common/components/loading-container';
import { CardWidget } from './components/cardwidget';

@Component({
  selector: 'app-dashboard',
  imports: [LoadingContainer, CardWidget],
  template: `
    <app-loading-container [loading]="loading" [error]="error">
      <div
        class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 md:gap-8 gap-4"
      >
        <app-card-widget
          class="col-span-3 lg:col-span-2 xl:col-span-1"
          title="Presupuestos"
          [description]="statsData?.budgetCount"
          icon="pi-file-edit"
          colorIcon="text-blue-500"
          colorBoxIcon="bg-blue-100"
          goToLink="/budgets"
        />

        <app-card-widget
          class="col-span-3 lg:col-span-2 xl:col-span-1"
          title="Trabajos"
          [description]="statsData?.workCount"
          icon="pi-hammer"
          colorIcon="text-orange-500"
          colorBoxIcon="bg-orange-100"
          goToLink="/works"
        />

        <app-card-widget
          class="col-span-3 lg:col-span-2 xl:col-span-1"
          title="Clientes"
          [description]="statsData?.clientCount"
          icon="pi-users"
          colorIcon="text-cyan-500"
          colorBoxIcon="bg-cyan-100"
          goToLink="/clients"
        />

        <app-card-widget
          class="col-span-3 lg:col-span-2 xl:col-span-1"
          title="Materiales"
          [description]="statsData?.materialCount"
          icon="pi-box"
          colorIcon="text-purple-500"
          colorBoxIcon="bg-purple-100"
          goToLink="/materials"
        />

        <app-card-widget
          class="col-span-3 lg:col-span-2 xl:col-span-1"
          title="Proveedores"
          [description]="statsData?.supplierCount"
          icon="pi-building"
          colorIcon="text-yellow-500"
          colorBoxIcon="bg-purple-100"
          goToLink="/suppliers"
        />
      </div>
    </app-loading-container>
  `,
})
export class DashboardPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected statsData?: StatsResponse;

  constructor(private stats: Stats) {}

  public ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.error = null;
    this.loading = true;

    this.stats.getStats().subscribe({
      next: (value) => {
        this.statsData = value;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
