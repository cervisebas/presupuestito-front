import { SupplierResponse } from '@/common/api/interfaces/responses/SupplierResponse';
import { Supplier } from '@/common/api/services/supplier';
import { LoadingContainer } from '@/common/components/loading-container';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DebounceInput } from '@/common/directives/debounce-input';
import { ArraySearch } from '@/common/services/array-search';
import { SupplierForm } from './modals/supplier-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '@/common/services/loading';
import { DevService } from '@/common/services/dev-service';
import { SupplierInfo } from './modals/supplier-info';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { SupplierTestService } from './services/supplier-test-service';
import { DCuilPipe } from '@/common/pipes/d-cuil-pipe';
import { PhonePipe } from '@/common/pipes/phone-pipe';
import { NgStyle } from '@angular/common';

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
    SupplierForm,
    SupplierInfo,
    ConfirmDialog,
    Toast,
    NgStyle,
    DCuilPipe,
    PhonePipe,
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
          @if (devService.isDevMode()) {
            <p-button
              label="Eliminar todo"
              icon="pi pi-trash"
              severity="danger"
              (onClick)="deleteAllSuppliers()"
            />
          }

          @if (devService.isDevMode()) {
            <p-button
              label="Añadir 50 elementos"
              icon="pi pi-plus"
              severity="help"
              (onClick)="createManyElements()"
            />
          }

          <p-button
            label="Añadir"
            icon="pi pi-plus"
            (onClick)="supplierForm?.open()"
          />
        </div>
      </div>

      <p-table
        [value]="supplierData"
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
        <ng-template #body let-supplier>
          <tr>
            <td>{{ supplier.personId?.nameCompany || '-' }}</td>
            <td>{{ supplier.personId?.cuit || '-' | dCuil }}</td>
            <td>{{ supplier.personId?.phoneNumber || '-' | phone }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                  (onClick)="SupplierInfo?.open(supplier)"
                />
                <p-button
                  icon="pi pi-pencil"
                  severity="warn"
                  aria-label="Editar"
                  (onClick)="supplierForm?.open(supplier)"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                  (onClick)="deleteSupplier($event, supplier)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <p-confirmdialog styleClass="max-w-9/10" />
    <p-toast position="bottom-right" />

    <app-supplier-info />
    <app-supplier-form (reloadTable)="loadData()" />
  `,
})
export class SupplierPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $supplierData: SupplierResponse[] = [];
  protected supplierData: SupplierResponse[] = [];

  @ViewChild(SupplierForm)
  protected supplierForm?: SupplierForm;

  @ViewChild(SupplierInfo)
  protected SupplierInfo?: SupplierInfo;

  protected tableHeaderItems = [
    {
      key: 'personId.nameCompany',
      label: 'Empresa',
    },
    {
      key: 'personId.cuit',
      label: 'Cuit',
    },
    {
      key: 'personId.phoneNumber',
      label: 'Telefono',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];
  constructor(
    private supplier: Supplier,
    private arraySearch: ArraySearch,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    protected devService: DevService,
    private supplierTestService: SupplierTestService,
  ) {}

  public ngOnInit() {
    this.loadData();
  }

  protected onSearch(event: string) {
    this.supplierData = this.arraySearch.search(
      this.$supplierData,
      [
        'personId.nameCompany',
        'personId.name',
        'personId.lastname',
        'personId.street',
        'personId.streetNumber',
        'personId.locality',
        'personId.phoneNumber',
        'personId.email',
        'personId.dni',
        'personId.cuit',
      ],
      event,
    );
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.supplier.getSuppliers().subscribe({
      next: (supplier: SupplierResponse[]) => {
        this.$supplierData = [...supplier];
        this.supplierData = supplier;
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

  protected deleteSupplier(event: Event, supplier: SupplierResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el proveedor "${supplier.personId.name}"? Esta acción no se prodra deshacer.`,
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
        this.supplier.deleteSupplier(supplier.supplierId).subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'info',
              summary: 'Proveedor eliminado',
              detail: `Se elimino correctamente el proveedor "${supplier.personId.name}".`,
            });
            this.loadData();
          },
          error: (error) => {
            console.error(error);
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar proveedor',
              detail:
                'Ocurrio un error inesperado al eliminar el proveedor, por favor pruebe de nuevo más tarde.',
            });
          },
        });
      },
    });
  }

  protected async createManyElements() {
    this.loadingService.setLoading(true);

    try {
      await this.supplierTestService.createManySuppliers(50);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
      this.loadData();
    }
  }

  protected async deleteAllSuppliers() {
    this.loadingService.setLoading(true);

    try {
      await this.supplierTestService.deleteAllSuppliers();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
      this.loadData();
    }
  }
}
