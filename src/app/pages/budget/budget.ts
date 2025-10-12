import { LoadingContainer } from '@/common/components/loading-container';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DebounceInput } from '@/common/directives/debounce-input';
import { ArraySearch } from '@/common/services/array-search';
import { BudgetForm } from './modals/budge-form/budget-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePipe, NgStyle } from '@angular/common';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { LoadingService } from '@/common/services/loading';
import { DevService } from '@/common/services/dev-service';
import { MaterialInfo } from './modals/material-info';
import { Budget } from '@/common/api/services/budget';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';

@Component({
  selector: 'app-budget',
  imports: [
    Button,
    InputIcon,
    IconField,
    TableModule,
    DebounceInput,
    InputTextModule,
    LoadingContainer,
    BudgetForm,
    ConfirmDialogModule,
    ToastModule,
    NgStyle,
    CurrencyPipe,
    MaterialInfo,
    DatePipe,
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

        <div class="flex flex-row gap-4">
          <p-button
            label="Añadir"
            icon="pi pi-plus"
            (onClick)="materialForm?.open()"
          />
        </div>
      </div>

      <p-table
        [value]="budgetData"
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
        <ng-template #body let-product>
          <tr>
            <td>
              {{ product.clientId.personId.name }}
              {{ ' ' }}
              {{ product.clientId.personId.lastName }}
            </td>
            <td>{{ product.dateCreated | date: 'dd/MM/yyyy' }}</td>
            <td>{{ product.budgetStatus }}</td>
            <td>{{ product.cost | currency }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                  (onClick)="materialInfo?.open(product)"
                />

                <p-button
                  icon="pi pi-pencil"
                  severity="warn"
                  aria-label="Editar"
                  (onClick)="materialForm?.open(product)"
                />

                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                  (onClick)="deleteMaterial($event, product)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <p-confirmdialog styleClass="max-w-9/10" />
    <p-toast position="bottom-right" />

    <app-budget-form (reloadTable)="loadData()" />
    <app-material-info />
  `,
})
export class BudgetPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $budgetData: BudgetResponse[] = [];
  protected budgetData: BudgetResponse[] = [];

  @ViewChild(BudgetForm)
  protected materialForm?: BudgetForm;

  @ViewChild(MaterialInfo)
  protected materialInfo?: MaterialInfo;

  protected tableHeaderItems = [
    {
      key: 'clientId.personId.name',
      label: 'Cliente',
    },
    {
      key: 'dateCreated',
      label: 'Fecha',
    },
    {
      key: 'budgetStatus',
      label: 'Estado',
    },
    {
      key: 'cost',
      label: 'Precio',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];

  //private filterValue?: MaterialFilterSettings;
  private searchValue = '';

  constructor(
    private budget: Budget,
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
    this.searchValue = event;
    this.applySearch();
    //this.applyFilters();
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.budget.getBudgets().subscribe({
      next: (budgets) => {
        this.$budgetData = [...budgets];
        this.budgetData = budgets;
        //this.applyFilters();
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

  private applySearch() {
    this.budgetData = this.arraySearch.search(
      this.$budgetData,
      [
        'clientId.personId.name',
        'clientId.personId.lastName',
        'budgetStatus',
        'dateCreated',
        'descriptionBudget',
      ],
      this.searchValue,
    );
  }

  protected deleteMaterial(event: Event, budget: BudgetResponse) {
    const clientName =
      budget.clientId.personId.name + ' ' + budget.clientId.personId.lastName;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el presupuesto de "${clientName}"? Esta acción eliminara ${budget.works.length} ${budget.works.length === 1 ? 'trabajo' : 'trabajos'} y no se prodra deshacer.`,
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
        this.budget.deleteBudget(budget.budgetId).subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'info',
              summary: 'Material eliminado',
              detail: `Se elimino correctamente el presupuesto de "${clientName}"?.`,
            });
            this.loadData();
          },
          error: (error) => {
            console.error(error);
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar presupuesto',
              detail:
                'Ocurrio un error inesperado al eliminar el presupuesto, por favor pruebe de nuevo más tarde.',
            });
          },
        });
      },
    });
  }

  /* protected onFilter(_filter: MaterialFilterSettings) {
    this.filterValue = _filter;
    this.applySearch();
    //this.applyFilters();
  } */
}
