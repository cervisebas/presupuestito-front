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
import { MaterialResponse } from '@/common/api/interfaces/responses/MaterialResponse';
import { InputNumberModule } from 'primeng/inputnumber';

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
    InputNumberModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      [header]="isEditing ? 'Editar material' : 'Añadir nuevo material'"
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
          <p-inputnumber
            inputId="price-input"
            mode="currency"
            currency="ARS"
            locale="es-AR"
            formControlName="price"
            styleClass="w-full"
          />

          <label for="price-input">Precio</label>
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
            @if (!isEditing) {
              <p-button
                label="Limpiar"
                severity="secondary"
                (onClick)="formGroup.reset()"
              />
            }

            <p-button
              label="Guardar"
              [disabled]="formGroup.invalid"
              (onClick)="saveData()"
            />
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
    price: new FormControl(1, [Validators.required, Validators.min(1)]),
    color: new FormControl('', [Validators.required]),
    size: new FormControl<number | null>(1, [
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

  private $editData?: MaterialResponse;

  constructor(
    private categoryService: Category,
    private subcategoryService: Subcategory,
    private materialService: Material,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(editData?: MaterialResponse) {
    this.formGroup.reset({
      price: 1,
      size: 1,
    });
    this.visible = true;
    this.$editData = editData;

    try {
      this.loadingService.setLoading(true);
      await this.loadCategories();
      await this.loadEditData();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  private async loadEditData() {
    if (this.$editData) {
      const data = this.$editData;

      this.formGroup.setValue({
        name: data.materialName,
        description: data.materialDescription,
        brand: data.materialBrand,
        price: data.price,
        color: data.materialColor,
        size: Number(data.materialMeasure),
        unitSize: data.materialUnitMeasure,
        category: data.subCategoryMaterialId.categoryId.categoryName,
        subCategory: null,
      });

      await this.loadSubCategories();

      this.formGroup.controls.subCategory.setValue(
        data.subCategoryMaterialId.subCategoryName,
      );
    }
  }

  private async loadCategories() {
    try {
      const { category, subCategory } = this.formGroup.controls;

      // Se desabilitan los campos "Rubros" y "Subrubros"
      category.disable();
      subCategory.disable();

      // Se establece como cargando el campo "Rubros" y se obtienen los datos.
      this.categoryLoading = true;
      const categories = await lastValueFrom(
        this.categoryService.getCategories(),
      );

      // Una vez obtenidos los datos, se rehabilitan los campos deshabilitados.
      category.enable();
      subCategory.enable();

      // Se guardan los datos en los atributos y termina la carga.
      this.$categoryList = categories;
      this.categoryList = categories.map((v) => v.categoryName);
      this.categoryLoading = false;
    } catch (error) {
      // En caso de error de se muestra en consola lo que sucedio y se notifica al usaurio.
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear material',
        detail:
          'Ocurrio un error inesperado al cargar los rubros, por favor pruebe de nuevo más tarde.',
      });
    }
  }

  protected async loadSubCategories() {
    try {
      const { category, subCategory } = this.formGroup.controls;

      // Si el campo "Rubro" esta en blanco, se omite la carga de datos.
      if (!category.value) {
        return;
      }

      // Se deshabilita el campo "Sub-Rubro" y se elimina el valor establecido.
      subCategory.disable();
      subCategory.reset();

      // Si el campo "Rubro" es nuevo, no se omite la carga de datos.
      if (!this.categoryList.includes(category.value)) {
        subCategory.enable();

        return;
      }

      // Se establece como cargando el campo "Sub-Rubros" y se obtienen los datos.
      this.subCategoryLoading = true;
      const subcategories = await lastValueFrom(
        this.subcategoryService.getSubcategories(),
      );

      // Una vez obtenidos los datos, se rehabilitan el campo deshabilitado.
      subCategory.enable();

      // Se guardan los datos en los atributos y termina la carga.
      this.$subCategoryList = subcategories;
      this.subCategoryLoading = false;

      const Category = this.$categoryList?.find(
        (v) => v.categoryName === category.value,
      );

      if (!Category) {
        return;
      }

      this.subCategoryList = subcategories
        .filter((v) => v.categoryId.categoryId === Category.categoryId)
        .map((v) => v.subCategoryName);
    } catch (error) {
      // En caso de error de se muestra en consola lo que sucedio y se notifica al usaurio.
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear material',
        detail:
          'Ocurrio un error inesperado al cargar los sub-rubros, por favor pruebe de nuevo más tarde.',
      });
    }
  }

  private async getCategoryId(categoryName: string) {
    // Se comprueba si el Rubro es nuevo o no.
    const findCategory = this.$categoryList?.find(
      (v) => v.categoryName.toLowerCase() === categoryName?.toLowerCase(),
    );

    // Si es nuevo, se crea un nuevo Rubro con el nombre ingresado.
    if (!findCategory) {
      const newCategory = await lastValueFrom(
        this.categoryService.createCategory({
          CategoryName: categoryName!,
        }),
      );

      return newCategory.categoryId;
    }

    // Si no es nuevo, se retorna el ID del Rubro existente.
    return findCategory.categoryId;
  }

  private async getSubCategoryId(subCategoryName: string, categoryId: number) {
    // Se comprueba si el Sub-Rubro es nuevo o no.
    const findSubCategory = this.$subCategoryList?.find(
      (v) => v.subCategoryName.toLowerCase() === subCategoryName?.toLowerCase(),
    );

    // Si es nuevo, se crea un nuevo Sub-Rubro con el nombre ingresado.
    if (!findSubCategory) {
      const newSubcategory = await lastValueFrom(
        this.subcategoryService.createSubcategory({
          subCategoryName: subCategoryName!,
          categoryId: categoryId,
        }),
      );

      return newSubcategory.subCategoryMaterialId;
    }

    // Si no es nuevo, se retorna el ID del Sub-Rubro existente.
    return findSubCategory.subCategoryMaterialId;
  }

  protected async saveData() {
    try {
      this.loadingService.setLoading(true);

      // Se obtienen los datos del formulario
      const formValue = this.formGroup.value;

      // Se guarda el ID del Rubro y Sub-Rubro
      const categoryId = await this.getCategoryId(formValue.category!);
      const subCategoryId = await this.getSubCategoryId(
        formValue.subCategory!,
        categoryId,
      );

      // Se arma el objeto que se enviara a la consulta.
      const data: MaterialRequest = {
        MaterialId: this.$editData?.materialId,
        price: Number(formValue.price),
        MaterialName: formValue.name!,
        MaterialDescription: formValue.description!,
        MaterialColor: formValue.color!,
        MaterialBrand: formValue.brand!,
        MaterialMeasure: String(formValue.size!),
        MaterialUnitMeasure: formValue.unitSize!,
        SubCategoryMaterialId: subCategoryId,
      };

      if (this.isEditing) {
        await lastValueFrom(this.materialService.updateMaterial(data));
      } else {
        await lastValueFrom(this.materialService.createMaterial(data));
      }

      this.visible = false;
      this.reloadTable.emit();
      this.messageService.add({
        severity: 'success',
        summary: `¡Material ${this.isEditing ? 'editado' : 'creado'}!`,
        detail: `Se ${this.isEditing ? 'edito' : 'creo'} el material "${data.MaterialName}" correctamente.`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Error al ${this.isEditing ? 'editar' : 'crear'} material`,
        detail: `Ocurrio un error inesperado al ${this.isEditing ? 'editar' : 'crear'} el material, por favor pruebe de nuevo más tarde.`,
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  protected get isEditing() {
    return Boolean(this.$editData);
  }
}
