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
import { BudgetStatements } from '../constants/BudgetStatements';
import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { Client } from '@/common/api/services/client';
import { Budget } from '@/common/api/services/budget';

@Component({
  selector: 'app-budget-form',
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
        <p-select
          [options]="categoryList"
          [loading]="categoryLoading"
          formControlName="category"
          placeholder="Seleccióne un rubro"
          [editable]="true"
          (onBlur)="loadSubCategories()"
        />

        <p-select
          [options]="budgetStatements"
          formControlName="status"
          placeholder="Seleccióne un estado"
          [editable]="false"
        />

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
export class BudgetForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected readonly budgetStatements = BudgetStatements;

  protected visible = false;
  protected formGroup = new FormGroup({
    client: new FormControl('', [Validators.required]),
    startDate: new FormControl(new Date(), [Validators.required]),
    endDate: new FormControl(new Date(), [Validators.required]),
    desdcription: new FormControl('', []),
    status: new FormControl(this.budgetStatements.at(0), [Validators.required]),
  });

  protected categoryLoading = false;
  protected subCategoryLoading = false;

  protected clientList: string[] = [];

  private $clientList?: ClientResponse[];

  private $editData?: MaterialResponse;

  constructor(
    private clientService: Client,
    private budgetService: Budget,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(editData?: MaterialResponse) {
    this.formGroup.reset({
      startDate: new Date(),
      endDate: new Date(),
      status: this.budgetStatements.at(0),
    });
    this.visible = true;
    this.$editData = editData;

    try {
      this.loadingService.setLoading(true);
      await this.loadClients();
      this.loadEditData();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  private async loadEditData() {
    if (this.$editData) {
      const data = this.$editData;

      /* this.formGroup.setValue({
        client: 
        startDate
        endDate
        desdcription
        status
      }); */

      await this.loadSubCategories();

      this.formGroup.controls.subCategory.setValue(
        data.subCategoryMaterialId.subCategoryName,
      );
    }
  }

  private async loadClients() {
    try {
      const { client } = this.formGroup.controls;

      const clients = await lastValueFrom(this.clientService.getClients());

      this.clientList = clients.map(
        (client) => client.personId.name + ' ' + client.personId.lastName,
      );
      this.$clientList = clients;

      client.setValue(this.clientList[0]);
    } catch (error) {
      // En caso de error de se muestra en consola lo que sucedio y se notifica al usaurio.
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar los clients',
        detail:
          'Ocurrio un error inesperado al cargar los clientes, por favor pruebe de nuevo más tarde.',
      });
    }
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
        summary: '¡Material creado!',
        detail: `Se ${this.isEditing ? 'edito' : 'creo'} el material "${data.MaterialName}" correctamente.`,
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

  protected get isEditing() {
    return Boolean(this.$editData);
  }
}
