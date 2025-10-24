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
import { BudgetInfo } from './modals/budget-info/budget-info';
import { Budget } from '@/common/api/services/budget';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { Router } from '@angular/router';

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
    DatePipe,
    BudgetInfo,
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
            <td>{{ product.deadLine | date: 'dd/MM/yyyy' }}</td>
            <td>{{ product.budgetStatus }}</td>
            <td>{{ getBudgetPrice(product) | currency }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                  (onClick)="budgetInfo?.open(product)"
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
                  (onClick)="deleteBudget($event, product)"
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
    <app-budget-info />
  `,
})
export class BudgetPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $budgetData: BudgetResponse[] = [];
  protected budgetData: BudgetResponse[] = [];

  @ViewChild(BudgetForm)
  protected materialForm?: BudgetForm;

  @ViewChild(BudgetInfo)
  protected budgetInfo?: BudgetInfo;

  protected tableHeaderItems = [
    {
      key: 'clientId.personId.name',
      label: 'Cliente',
    },
    {
      key: 'dateCreated',
      label: 'Fecha inicio',
    },
    {
      key: 'deadLine',
      label: 'Fecha final',
    },
    {
      key: 'budgetStatus',
      label: 'Estado',
    },
    {
      key: 'cost',
      label: 'Precio total',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];

  //private filterValue?: MaterialFilterSettings;
  private searchValue = '';
  private openBudgetId?: number;

  constructor(
    private budget: Budget,
    private arraySearch: ArraySearch,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    protected devService: DevService,
    private router: Router,
  ) {
    this.checkIfShouldOpenBudget(
      router.currentNavigation()?.extras?.state ?? {},
    );
  }

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
        this.openReveivedBudget();
      },
      complete: () => {
        this.loading = false;
        this.openReveivedBudget();
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

  private openReveivedBudget() {
    if (!this.openBudgetId) return;

    const budgetData = this.$budgetData.find(
      (budget) => budget.budgetId === this.openBudgetId,
    );

    if (budgetData) {
      this.budgetInfo?.open(budgetData);
    }

    this.loadingService.setLoading(false);
  }

  private checkIfShouldOpenBudget(states: Record<string, any>) {
    this.openBudgetId = states?.['budgetId'];

    if (this.openBudgetId) {
      this.loadingService.setLoading(true);
    }
  }

  protected deleteBudget(event: Event, budget: BudgetResponse) {
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

  protected getBudgetPrice(budget: BudgetResponse) {
    let price = 0;

    for (const work of budget.works) {
      for (const item of work.itemsId) {
        price += item.price * item.quantity;
      }

      price += work.costPrice;
    }

    return price;
  }
}
