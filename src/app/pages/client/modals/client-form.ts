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
import { lastValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '@/common/services/loading';
import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { ClientRequest } from '@/common/api/interfaces/requests/ClientRequest';
import { Client } from '@/common/api/services/client';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-client-form',
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
      [header]="isEditing ? 'Editar cliente' : 'Añadir nuevo cliente'"
      [blockScroll]="false"
      styleClass="w-[30rem] h-[95vh] max-w-[95vw]"
      contentStyleClass="size-full"
    >
      <form [formGroup]="formGroup" class="flex flex-col gap-4 pt-3">
        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="name-input"
            class="w-full"
            autocomplete="off"
            formControlName="name"
          />
          <label for="name-input">Nombre *</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="name-input"
            class="w-full"
            autocomplete="off"
            formControlName="lastname"
          />
          <label for="name-input">Apellido</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="brand-input"
            class="w-full"
            autocomplete="off"
            formControlName="street"
          />
          <label for="brand-input">Calle</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="color-input"
            class="w-full"
            autocomplete="off"
            formControlName="streetNumber"
          />
          <label for="color-input">Numero</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="size-input"
            class="w-full"
            autocomplete="off"
            formControlName="locality"
          />
          <label for="size-input">Localidad</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
            formControlName="phoneNumber"
          />
          <label for="unit-size-input">Telefono *</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
            formControlName="email"
          />
          <label for="unit-size-input">Email</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
            formControlName="dni"
          />
          <label for="unit-size-input">Dni</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
            formControlName="cuit"
          />
          <label for="unit-size-input">Cuit</label>
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
export class ClientForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;
  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    locality: new FormControl('', []),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', []),
    dni: new FormControl('', []),
    cuit: new FormControl('', []),
  });

  private $editData?: ClientResponse;

  constructor(
    private clienteService: Client,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(editData?: ClientResponse) {
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
      const data: ClientRequest = {
        clientId: this.$editData?.clientId,
        name: formValue.name!,
        lastName: formValue.lastname!,
        street: formValue.street!,
        streetNumber: formValue.streetNumber!,
        locality: formValue.locality!,
        phoneNumber: formValue.phoneNumber!,
        email: formValue.email!,
        dni: formValue.dni!,
        cuit: formValue.cuit!,
      };

      if (this.isEditing) {
        await lastValueFrom(this.clienteService.updateClient(data));
      } else {
        await lastValueFrom(this.clienteService.createClient(data));
      }

      this.visible = false;
      this.reloadTable.emit();
      this.messageService.add({
        severity: 'success',
        summary: `¡Cliente ${this.isEditing ? 'editado' : 'creado'}!`,
        detail: `Se ${this.isEditing ? 'editó' : 'creó'} el cliente "${data.name}" correctamente.`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Error al ${this.isEditing ? 'editar' : 'crear'} cliente`,
        detail:
          'Ocurrió un error inesperado al guardar el cliente, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  protected get isEditing() {
    return Boolean(this.$editData);
  }
}
