import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { Subcategory } from '@/common/api/services/subcategory';
import { lastValueFrom } from 'rxjs';
import { Category } from '@/common/api/services/category';
import { CategoryResponse } from '@/common/api/interfaces/responses/CategoryResponse';
import { SubCategoryMaterialResponse } from '@/common/api/interfaces/responses/SubCategoryMaterialResponse';
import { MaterialRequest } from '@/common/api/interfaces/requests/MaterialRequest';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Material } from '@/common/api/services/material';
import { LoadingService } from '@/common/services/loading';

@Component({
  selector: 'app-material-form',
  imports: [
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      header="Añadir nuevo material"
      [blockScroll]="false"
      styleClass="w-[30rem] h-[95vh] max-w-[95vw]"
      contentStyleClass="size-full"
    >
      <form [formGroup]="formGroup" class="flex flex-col gap-4 pt-3 h-full">
        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="name-input"
            class="w-full"
            autocomplete="off"
            formControlName="name"
          />
          <label for="name-input">Nombre</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <textarea
            pTextarea
            id="description-input"
            rows="5"
            cols="30"
            style="resize: none"
            class="h-full !w-full"
            formControlName="description"
          ></textarea>

          <label for="description-input">Descripción</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="brand-input"
            class="w-full"
            autocomplete="off"
            formControlName="brand"
          />
          <label for="brand-input">Marca</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="color-input"
            class="w-full"
            autocomplete="off"
            formControlName="color"
          />
          <label for="color-input">Color</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="size-input"
            type="number"
            class="w-full"
            autocomplete="off"
            formControlName="size"
          />
          <label for="size-input">Medida</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
            formControlName="unitSize"
          />
          <label for="unit-size-input">Unidad de medida</label>
        </p-floatlabel>

        <p-select
          [options]="categoryList"
          [loading]="categoryLoading"
          formControlName="category"
          placeholder="Seleccióne un rubro"
          [editable]="true"
          (onBlur)="loadSubCategories()"
        />

        <p-select
          [options]="subCategoryList"
          [loading]="subCategoryLoading"
          formControlName="subCategory"
          placeholder="Seleccióne un subrubro"
          [editable]="true"
        />
      </form>

      <ng-template #footer>
        <div class="w-full flex flex-row">
          <div class="flex flex-1 justify-end gap-2">
            <p-button
              label="Limpiar"
              severity="secondary"
              (onClick)="formGroup.reset()"
            />

            <!-- [disabled]="formGroup.invalid" -->
            <p-button label="Siguiente" (onClick)="create()" />
          </div>
        </div>
      </ng-template>
    </p-dialog>

    <p-toast />
  `,
})
export class MaterialForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;
  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    size: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    unitSize: new FormControl('', [Validators.required]),

    category: new FormControl('', [Validators.required]),
    subCategory: new FormControl('', [Validators.required]),
  });

  protected categoryLoading = false;
  protected subCategoryLoading = false;

  protected categoryList: string[] = [];
  protected subCategoryList: string[] = [];

  private $categoryList?: CategoryResponse[];
  private $subCategoryList?: SubCategoryMaterialResponse[];

  constructor(
    private categoryService: Category,
    private subcategoryService: Subcategory,
    private materialService: Material,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public open() {
    this.formGroup.reset();
    this.visible = true;

    this.loadCategories();
  }

  private async loadCategories() {
    const { category, subCategory } = this.formGroup.controls;

    category.disable();
    subCategory.disable();

    this.categoryLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        category.enable();
        subCategory.enable();
        this.$categoryList = value;
        this.categoryList = value.map((v) => v.categoryName);
        this.categoryLoading = false;
      },
    });
  }

  protected async loadSubCategories() {
    const { category, subCategory } = this.formGroup.controls;

    if (!category.value) {
      return;
    }

    subCategory.disable();
    subCategory.reset();

    if (!this.categoryList.includes(category.value)) {
      subCategory.enable();

      return;
    }

    this.subCategoryLoading = true;
    this.subcategoryService.getSubcategories().subscribe({
      next: (value) => {
        this.$subCategoryList = value;
        this.subCategoryLoading = false;
        subCategory.enable();

        const Category = this.$categoryList?.find(
          (v) => v.categoryName === category.value,
        );

        if (!Category) {
          return;
        }

        this.subCategoryList = value
          .filter((v) => v.categoryId.categoryId === Category.categoryId)
          .map((v) => v.subCategoryName);
      },
    });
  }

  protected async create() {
    try {
      this.loadingService.setLoading(true);

      const formValue = this.formGroup.value;
      let categoryId = -1,
        subCategoryId = -1;

      const findCategory = this.$categoryList?.find(
        (v) =>
          v.categoryName.toLowerCase() === formValue.category?.toLowerCase(),
      );

      if (!findCategory) {
        const newCategory = await lastValueFrom(
          this.categoryService.createCategory({
            CategoryName: formValue.category!,
          }),
        );

        categoryId = newCategory.categoryId;
      } else {
        categoryId = findCategory.categoryId;
      }

      const findSubCategory = this.$subCategoryList?.find(
        (v) =>
          v.subCategoryName.toLowerCase() ===
          formValue.subCategory?.toLowerCase(),
      );

      if (!findSubCategory) {
        const newSubcategory = await lastValueFrom(
          this.subcategoryService.createSubcategory({
            subCategoryName: formValue.subCategory!,
            categoryId: categoryId,
          }),
        );

        subCategoryId = newSubcategory.subCategoryMaterialId;
      } else {
        subCategoryId = findSubCategory.subCategoryMaterialId;
      }

      const data: MaterialRequest = {
        MaterialName: formValue.name!,
        MaterialDescription: formValue.description!,
        MaterialColor: formValue.color!,
        MaterialBrand: formValue.brand!,
        MaterialMeasure: String(formValue.size!),
        MaterialUnitMeasure: formValue.unitSize!,
        SubCategoryMaterialId: subCategoryId,
      };

      await lastValueFrom(this.materialService.createMaterial(data));
      this.visible = false;

      this.reloadTable.emit();
      this.messageService.add({
        severity: 'success',
        summary: '¡Material creado!',
        detail: `Se creo el material "${data.MaterialName}" correctamente.`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear material',
        detail:
          'Ocurrio un error inesperado al crear el material, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }
}
