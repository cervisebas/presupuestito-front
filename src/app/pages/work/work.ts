import { LoadingContainer } from '@/common/components/loading-container';
import { Component, OnInit, viewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DebounceInput } from '@/common/directives/debounce-input';
import { ArraySearch } from '@/common/services/array-search';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '@/common/services/loading';
import { DevService } from '@/common/services/dev-service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { NgStyle, DatePipe } from '@angular/common';
import { WorkResponse } from '@/common/api/interfaces/responses/WorkResponse';
import { Work } from '@/common/api/services/work';
import { WorkInfo } from './modals/work-info';

@Component({
  selector: 'app-dashboard',
  imports: [
    Button,
    InputIcon,
    IconField,
    TableModule,
    DebounceInput,
    InputTextModule,
    LoadingContainer,
    ConfirmDialog,
    Toast,
    NgStyle,
    DatePipe,
    WorkInfo,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <app-loading-container [loading]="loading" [error]="error">
      <div
        class="px-5 pb-4 pt-4 flex flex-row justify-between items-center bg-(--p-paginator-background) rounded-t-(--p-paginator-border-radius) gap-4"
      >
        <p-iconfield class="w-full md:max-w-[300px]">
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            debounceInput
            type="search"
            class="w-full"
            placeholder="Buscar"
            [enableDebounce]="true"
            (onDebounce)="onSearch($event)"
          />
        </p-iconfield>
      </div>

      <p-table
        [value]="workData"
        [paginator]="true"
        [rows]="20"
        size="large"
        [tableStyle]="{ 'min-width': '60rem' }"
      >
        <ng-template #header>
          <tr>
            @for (item of tableHeaderItems; track $index) {
              <th
                [pSortableColumn]="item.key || undefined"
                [ngStyle]="{
                  width: 100 / tableHeaderItems.length + '%',
                }"
              >
                <div class="flex items-center gap-2">
                  {{ item.label }}
                  @if (item.key) {
                    <p-sortIcon [field]="item.key" />
                  }
                </div>
              </th>
            }
          </tr>
        </ng-template>
        <ng-template #body let-work>
          <tr>
            <td>{{ work.workName }}</td>
            <td>{{ work.workStatus }}</td>
            <td>{{ work.deadLine | date: 'dd/MM/yyyy' }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                  (onClick)="workInfo()?.open(work)"
                />
                <p-button
                  icon="pi pi-pencil"
                  severity="warn"
                  aria-label="Editar"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                  (onClick)="deleteWork($event, work)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <p-confirmdialog styleClass="max-w-9/10" />
    <p-toast position="bottom-right" />

    <app-work-info />
  `,
})
export class WorkPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $workData: WorkResponse[] = [];
  protected workData: WorkResponse[] = [];

  protected readonly workInfo = viewChild(WorkInfo);

  protected tableHeaderItems = [
    {
      key: 'workName',
      label: 'Nombre',
    },
    {
      key: 'workStatus',
      label: 'Estado',
    },
    {
      key: 'deadLine',
      label: 'Fecha Limite',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];

  constructor(
    private work: Work,
    private arraySearch: ArraySearch,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    protected devService: DevService,
  ) {}

  public ngOnInit() {
    this.loadData();
  }

  protected onSearch(event: string) {
    this.workData = this.arraySearch.search(
      this.$workData,
      [
        'workName',
        'workStatus',
        'deadLine',
        'estimatedHoursWorked',
        'costPrice',
        'notes',
      ],
      event,
    );
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.work.getWorks().subscribe({
      next: (works: WorkResponse[]) => {
        this.$workData = [...works];
        this.workData = works;
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

  protected deleteWork(event: Event, work: WorkResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `
      ¿Está seguro/a que desea eliminar el trabajo "${work.workName}"?
      <br><br>
      ⚠️ <strong>Advertencia:</strong> Esta acción afectará los presupuestos que ya lo incluyen.
      <br>
      No se podrá deshacer.
    `,
      header: 'Confirme eliminación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.loadingService.setLoading(true);
        this.work.deleteWork(work.workId).subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'info',
              summary: 'Trabajo eliminado',
              detail: `Se elimino correctamente el trabajo "${work.workName}".`,
            });
            this.loadData();
          },
          error: (error) => {
            console.error(error);
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar trabajo',
              detail:
                'Ocurrio un error inesperado al eliminar el trabajo, por favor pruebe de nuevo más tarde.',
            });
          },
        });
      },
    });
  }
}
