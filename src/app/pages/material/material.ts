import { MaterialResponse } from '@/common/api/interfaces/responses/MaterialResponse';
import { Material } from '@/common/api/services/material';
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
import { MaterialForm } from './modals/material-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgStyle } from '@angular/common';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';

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
    MaterialForm,
    ConfirmDialogModule,
    ToastModule,
    NgStyle,
    CurrencyPipe,
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

        <p-button
          label="Añadir"
          icon="pi pi-plus"
          (onClick)="materialForm?.open()"
        />
      </div>

      <p-table
        [value]="materialData"
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
                    <p-sortIcon field="materialName" />
                  }
                </div>
              </th>
            }
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.materialName }}</td>
            <td>{{ product.materialBrand }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.subCategoryMaterialId.categoryId.categoryName }}</td>
            <td>{{ product.subCategoryMaterialId.subCategoryName }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
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

    <app-material-form (reloadTable)="loadData()" />
  `,
})
export class MaterialPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $materialData: MaterialResponse[] = [];
  protected materialData: MaterialResponse[] = [];

  @ViewChild(MaterialForm)
  protected materialForm?: MaterialForm;

  protected tableHeaderItems = [
    {
      key: 'materialName',
      label: 'Nombre',
    },
    {
      key: 'materialBrand',
      label: 'Marca',
    },
    {
      key: 'price',
      label: 'Precio',
    },
    {
      key: 'subCategoryMaterialId.categoryId.categoryName',
      label: 'Rubro',
    },
    {
      key: 'subCategoryMaterialId.subCategoryName',
      label: 'Sub-Rubro',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];

  constructor(
    private material: Material,
    private arraySearch: ArraySearch,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  public ngOnInit() {
    this.loadData();
  }

  protected onSearch(event: string) {
    this.materialData = this.arraySearch.search(
      this.$materialData,
      [
        'materialName',
        'materialDescription',
        'materialBrand',
        'materialUnitMeasure',
        'subCategoryMaterialId.subCategoryName',
        'subCategoryMaterialId.categoryId.categoryName',
      ],
      event,
    );
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.material.getMaterials().subscribe({
      next: (material) => {
        this.$materialData = [...material];
        this.materialData = material;
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

  protected deleteMaterial(event: Event, material: MaterialResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el material "${material.materialName}"? Esta acción no se prodra deshacer.`,
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
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
