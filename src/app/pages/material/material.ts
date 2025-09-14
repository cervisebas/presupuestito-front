import { MaterialResponse } from '@/common/api/interfaces/responses/MaterialResponse';
import { Category } from '@/common/api/services/category';
import { Material } from '@/common/api/services/material';
import { Subcategory } from '@/common/api/services/subcategory';
import { LoadingContainer } from '@/common/components/loading-container';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DebounceInput } from '@/common/directives/debounce-input';
import { ArraySearch } from '@/common/services/array-search';

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
  ],
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

        <p-button label="Añadir" icon="pi pi-plus" />
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
            <th pSortableColumn="materialName" style="width: 20%">
              <div class="flex items-center gap-2">
                Nombre
                <p-sortIcon field="materialName" />
              </div>
            </th>
            <th pSortableColumn="materialDescription" style="width: 20%">
              <div class="flex items-center gap-2">
                Descripción
                <p-sortIcon field="materialDescription" />
              </div>
            </th>
            <th pSortableColumn="materialBrand" style="width: 20%">
              <div class="flex items-center gap-2">
                Marca
                <p-sortIcon field="materialBrand" />
              </div>
            </th>
            <th
              pSortableColumn="subCategoryMaterialId.subCategoryName"
              style="width: 20%"
            >
              <div class="flex items-center gap-2">
                Sub-Rubro
                <p-sortIcon field="subCategoryMaterialId.subCategoryName" />
              </div>
            </th>
            <th style="width: 20%">
              <div class="flex items-center gap-2">Acciónes</div>
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.materialName }}</td>
            <td>{{ product.materialDescription }}</td>
            <td>{{ product.materialBrand }}</td>
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
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>
  `,
})
export class MaterialPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $materialData: MaterialResponse[] = [];
  protected materialData: MaterialResponse[] = [];

  constructor(
    private material: Material,
    private arraySearch: ArraySearch,
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
      ],
      event,
    );
  }

  private loadData() {
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
}
