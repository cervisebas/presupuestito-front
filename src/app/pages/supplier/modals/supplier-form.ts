import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { lastValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '@/common/services/loading';
import { SupplierResponse } from '@/common/api/interfaces/responses/SupplierResponse';
import { SupplierRequest } from '@/common/api/interfaces/requests/SupplierRequest';
import { Supplier } from '@/common/api/services/supplier';
@Component({
  selector: 'app-supplier-form',
  imports: [
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputMaskModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      [header]="isEditing ? 'Editar proveedor' : 'Añadir nuevo proveedor'"
      [blockScroll]="false"
      styleClass="w-[30rem] h-max max-w-[95vw]"
      contentStyleClass="size-full"
    >
      <form [formGroup]="formGroup" class="flex flex-col gap-4 pt-3">
        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="name-input"
            class="w-full"
            autocomplete="off"
            formControlName="nameCompany"
          />
          <label for="name-input">Nombre Empresa *</label>
        </p-floatlabel>

        <div class="flex w-full flex-row gap-4">
          <p-floatlabel variant="on" class="w-full">
            <input
              pInputText
              id="street-input"
              class="w-full"
              autocomplete="off"
              formControlName="street"
            />
            <label for="street-input">Calle</label>
          </p-floatlabel>

          <p-floatlabel variant="on" class="w-full">
            <input
              pInputText
              id="number-input"
              class="w-full"
              autocomplete="off"
              formControlName="streetNumber"
            />
            <label for="number-input">Número</label>
          </p-floatlabel>
        </div>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="locality-input"
            class="w-full"
            autocomplete="off"
            formControlName="locality"
          />
          <label for="locality-input">Localidad</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <p-inputMask
            id="phone-input"
            class="w-full"
            styleClass="w-full"
            mask="(999) 999-9999"
            autocomplete="off"
            formControlName="phoneNumber"
          />
          <label for="phone-input">Teléfono *</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="email-input"
            class="w-full"
            autocomplete="off"
            formControlName="email"
          />
          <label for="email-input">E-mail</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <p-inputMask
            id="cuit-input"
            class="w-full"
            styleClass="w-full"
            mask="99-99999999-9"
            autocomplete="off"
            formControlName="cuit"
          />
          <label for="cuit-input">CUIT</label>
        </p-floatlabel>
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
export class SupplierForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;
  protected formGroup = new FormGroup({
    nameCompany: new FormControl('', [Validators.required]),
    name: new FormControl('', []),
    lastname: new FormControl('', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    locality: new FormControl('', []),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', []),
    dni: new FormControl('', []),
    cuit: new FormControl('', []),
  });

  private $editData?: SupplierResponse;

  constructor(
    private supplierService: Supplier,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(editData?: SupplierResponse) {
    this.formGroup.reset();
    this.visible = true;
    this.$editData = editData;

    try {
      this.loadingService.setLoading(true);
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
        nameCompany: data.personId.nameCompany ?? '',
        name: data.personId.name,
        lastname: data.personId.lastName ?? '',
        street: data.personId.street ?? '',
        streetNumber: data.personId.streetNumber ?? '',
        locality: data.personId.locality ?? '',
        phoneNumber: data.personId.phoneNumber,
        email: data.personId.email ?? '',
        dni: data.personId.dni ?? '',
        cuit: data.personId.cuit ?? '',
      });
    }
  }

  protected async saveData() {
    try {
      this.loadingService.setLoading(true);

      // Se obtienen los datos del formulario
      const formValue = this.formGroup.value;

      // Se arma el objeto que se enviara a la consulta.
      const data: SupplierRequest = {
        supplierId: this.$editData?.supplierId,
        nameCompany: formValue.nameCompany!,
        name: formValue.name!,
        lastname: formValue.lastname!,
        street: formValue.street!,
        streetNumber: formValue.streetNumber!,
        locality: formValue.locality!,
        phoneNumber: formValue.phoneNumber!,
        email: formValue.email!,
        dni: formValue.dni!,
        cuit: formValue.cuit!,
      };

      if (this.isEditing) {
        await lastValueFrom(this.supplierService.updateSupplier(data));
      } else {
        await lastValueFrom(this.supplierService.createSupplier(data));
      }

      this.visible = false;
      this.reloadTable.emit();
      this.messageService.add({
        severity: 'success',
        summary: `¡Proveedor ${this.isEditing ? 'editado' : 'creado'}!`,
        detail: `Se ${this.isEditing ? 'editó' : 'creó'} el proveedor "${data.nameCompany}" correctamente.`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Error al ${this.isEditing ? 'editar' : 'crear'} proveedor`,
        detail:
          'Ocurrió un error inesperado al guardar el proveedor, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  protected get isEditing() {
    return Boolean(this.$editData);
  }
}
