import { Component, OnInit } from '@angular/core';
import { LoadingContainer } from '@/common/components/loading-container';
import { CategoryWithSubcategoriesResponse } from '@/common/api/interfaces/responses/CategoryWithSubcategoriesResponse';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DebounceInput } from '@/common/directives/debounce-input';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ArraySearch } from '@/common/services/array-search';
import { DevService } from '@/common/services/dev-service';
import { LoadingService } from '@/common/services/loading';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '@/common/api/services/category';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SubCategoryMaterialResponse } from '@/common/api/interfaces/responses/SubCategoryMaterialResponse';
import { CategoryResponse } from '@/common/api/interfaces/responses/CategoryResponse';
import { Subcategory } from '@/common/api/services/subcategory';
import { FormsModule } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { CategoryForm } from './modals/category-form';
import { SubcategoryForm } from './modals/subcategory-form';

@Component({
  selector: 'app-categories-and-subcategories',
  imports: [
    LoadingContainer,
    InputTextModule,
    IconField,
    InputIcon,
    DebounceInput,
    Button,
    TableModule,
    ConfirmDialog,
    Toast,
    FormsModule,
    CategoryForm,
    SubcategoryForm,
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
            (onClick)="categoryForm.open()"
          />
        </div>
      </div>

      <p-table
        dataKey="categoryId"
        [value]="categoryData"
        [paginator]="true"
        [rows]="20"
        size="large"
        [tableStyle]="{ 'min-width': '60rem' }"
        [expandedRowKeys]="expandedRows"
      >
        <ng-template #header>
          <tr>
            <th class="w-1/10"></th>
            <th pSortableColumn="categoryName" class="w-6/10">
              <div class="flex items-center gap-2">
                Nombre
                <p-sortIcon field="subCategoryName" />
              </div>
            </th>
            <th class="w-2/10">
              <div class="flex items-center gap-2">C. Sub-Rubros</div>
            </th>
            <th class="w-1/10">
              <div class="flex items-center gap-2 justify-center">Acciones</div>
            </th>
          </tr>
        </ng-template>
        <ng-template
          #body
          let-category
          let-expanded="expanded"
          let-index="rowIndex"
        >
          <tr>
            <td>
              <p-button
                type="button"
                pRipple
                [pRowToggler]="category"
                [text]="true"
                severity="secondary"
                [rounded]="true"
                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
              />
            </td>
            <td
              [pEditableColumn]="category.categoryName"
              pEditableColumnField="categoryName"
            >
              <p-cellEditor>
                <ng-template #input>
                  <input
                    fluid
                    pInputText
                    type="text"
                    [(ngModel)]="category.categoryName"
                    (blur)="editCategory(category)"
                    (keydown.enter)="editCategory(category)"
                  />
                </ng-template>
                <ng-template #output>
                  {{ category.categoryName }}
                </ng-template>
              </p-cellEditor>
            </td>
            <td>
              {{ category.subCategories.length }}
              {{
                category.subCategories.length === 1 ? 'sub-rubro' : 'sub-rubros'
              }}
            </td>
            <td>
              <div class="flex flex-row gap-4 justify-center">
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                  (onClick)="deleteCategory($event, category)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #expandedrow let-category>
          <tr>
            <td colspan="7" class="bg-gray-100">
              <div class="p-4">
                <div class="w-full flex flex-row justify-between px-4">
                  <h5>Sub-Rubros</h5>

                  <p-button
                    label="Añadir"
                    icon="pi pi-plus"
                    (onClick)="subCategoryForm.open(category)"
                  />
                </div>
                <p-table [value]="category.subCategories" dataKey="categoryId">
                  <ng-template #header>
                    <tr>
                      <th
                        class="w-9/10 !bg-gray-100"
                        pSortableColumn="subCategoryName"
                      >
                        <div class="flex items-center gap-2">
                          Nombre
                          <p-sortIcon field="subCategoryName" />
                        </div>
                      </th>
                      <th class="w-1/10 !bg-gray-100">
                        <div class="flex items-center gap-2 justify-center">
                          Acciónes
                        </div>
                      </th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-subcategory let-eIndex="rowIndex">
                    <tr>
                      <td
                        class="!bg-gray-100"
                        [pEditableColumn]="subcategory.subCategoryName"
                        pEditableColumnField="subCategoryName"
                      >
                        <p-cellEditor>
                          <ng-template #input>
                            <input
                              fluid
                              pInputText
                              type="text"
                              [(ngModel)]="subcategory.subCategoryName"
                              (blur)="editSubCategory(category, subcategory)"
                              (keydown.enter)="
                                editSubCategory(category, subcategory)
                              "
                            />
                          </ng-template>
                          <ng-template #output>
                            {{ subcategory.subCategoryName }}
                          </ng-template>
                        </p-cellEditor>
                      </td>
                      <td class="!bg-gray-100">
                        <div class="flex flex-row gap-4 justify-center">
                          <p-button
                            icon="pi pi-trash"
                            severity="warn"
                            aria-label="Eliminar"
                            (onClick)="deleteSubCategory($event, subcategory)"
                          />
                        </div>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <p-confirmdialog styleClass="max-w-9/10" />
    <p-toast position="bottom-right" />

    <app-category-form #categoryForm (reloadTable)="loadData()" />
    <app-subcategory-form #subCategoryForm (reloadTable)="loadData()" />
  `,
})
export class CategoriesAndSubcategoriesPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $categoryData: CategoryWithSubcategoriesResponse[] = [];
  protected categoryData: CategoryWithSubcategoriesResponse[] = [];

  private searchValue = '';

  protected expandedRows = {};

  constructor(
    private category: Category,
    private subCategory: Subcategory,
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
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.category.getCategoriesWithSuncategories().subscribe({
      next: (categories) => {
        this.$categoryData = cloneDeep(categories);
        this.categoryData = categories;
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
    this.categoryData = this.arraySearch.search(
      this.$categoryData,
      ['categoryName', 'subCategories.subCategoryName'],
      this.searchValue,
    );
  }

  protected deleteCategory(event: Event, category: CategoryResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el Rubro "${category.categoryName}"? Esta acción no se prodra deshacer.`,
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
        this.category.deleteCategory(category.categoryId).subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'info',
              summary: 'Rubro eliminado',
              detail: `Se elimino correctamente el Rubro "${category.categoryName}"?.`,
            });
            this.loadData();
          },
          error: (error) => {
            console.error(error);
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar el Rubro',
              detail:
                'Ocurrio un error inesperado al eliminar el Rubro, por favor pruebe de nuevo más tarde.',
            });
          },
        });
      },
    });
  }

  protected editCategory(category: CategoryResponse) {
    const _category = this.$categoryData.find(
      (c) => c.categoryId === category.categoryId,
    );

    if (!_category) {
      return;
    }

    if (category.categoryName === _category.categoryName) {
      return;
    }

    this.loadingService.setLoading(true);
    this.category
      .updateCategory(category.categoryId, {
        CategoryName: category.categoryName,
      })
      .subscribe({
        next: () => {
          this.loadingService.setLoading(false);
          this.messageService.add({
            severity: 'info',
            summary: 'Rubro editado',
            detail: `Se edito correctamente el Rubro "${category.categoryName}"?.`,
          });
          this.loadData();
        },
        error: (error) => {
          console.error(error);
          this.loadingService.setLoading(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al editar el Rubro',
            detail:
              'Ocurrio un error inesperado al editar el Rubro, por favor pruebe de nuevo más tarde.',
          });
          this.loadData();
        },
      });
  }

  protected editSubCategory(
    category: CategoryResponse,
    subCategory: SubCategoryMaterialResponse,
  ) {
    const _category = this.$categoryData.find(
      (c) => c.categoryId === category.categoryId,
    );

    if (!_category) {
      return;
    }

    const _subcategory = _category.subCategories.find(
      (s) => s.subCategoryMaterialId === subCategory.subCategoryMaterialId,
    );

    if (!_subcategory) {
      return;
    }

    if (subCategory.subCategoryName === _subcategory.subCategoryName) {
      return;
    }

    this.loadingService.setLoading(true);
    this.subCategory
      .updateSubcategory(subCategory.subCategoryMaterialId, {
        subCategoryName: subCategory.subCategoryName,
        categoryId: category.categoryId,
      })
      .subscribe({
        next: () => {
          this.loadingService.setLoading(false);
          this.messageService.add({
            severity: 'info',
            summary: 'Sub-Rubro editado',
            detail: `Se edito correctamente el Sub-Rubro "${subCategory.subCategoryName}"?.`,
          });
          this.loadData();
        },
        error: (error) => {
          console.error(error);
          this.loadingService.setLoading(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al editar el Sub-Rubro',
            detail:
              'Ocurrio un error inesperado al editar el Sub-Rubro, por favor pruebe de nuevo más tarde.',
          });
          this.loadData();
        },
      });
  }

  protected deleteSubCategory(
    event: Event,
    subCategory: SubCategoryMaterialResponse,
  ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el Sub-Rubro "${subCategory.subCategoryName}"? Esta acción no se prodra deshacer.`,
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
        this.subCategory
          .deleteSubcategory(subCategory.subCategoryMaterialId)
          .subscribe({
            next: () => {
              this.loadingService.setLoading(false);
              this.messageService.add({
                severity: 'info',
                summary: 'Sub-Rubro eliminado',
                detail: `Se elimino correctamente el Sub-Rubro "${subCategory.subCategoryName}"?.`,
              });
              this.loadData();
            },
            error: (error) => {
              console.error(error);
              this.loadingService.setLoading(false);
              this.messageService.add({
                severity: 'error',
                summary: 'Error al eliminar el Sub-Rubro',
                detail:
                  'Ocurrio un error inesperado al eliminar el Sub-Rubro, por favor pruebe de nuevo más tarde.',
              });
            },
          });
      },
    });
  }
}
