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
import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { ClientRequest } from '@/common/api/interfaces/requests/ClientRequest';
import { Client } from '@/common/api/services/client';
import { Person } from '@/common/api/services/person';

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
      [header]="isEditing ? 'Editar cliente' : 'Añadir nuevo cliente'"
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
            formControlName="name"
          />
          <label for="name-input">
            Nombre
            <b class="text-red-400">*</b>
          </label>
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
            <label for="number-input">Numero</label>
          </p-floatlabel>
        </div>

        <p-select
          [options]="localitiesList"
          [loading]="localitiesLoading"
          formControlName="locality"
          placeholder="Localidad"
          [editable]="true"
          appendTo="body"
        />

        <p-floatlabel variant="on" class="w-full">
          <p-inputmask
            id="phone-input"
            class="w-full"
            styleClass="w-full"
            mask="(999) 999-9999"
            autocomplete="off"
            formControlName="phoneNumber"
          />
          <label for="phone-input">
            Teléfono
            <b class="text-red-400">*</b>
          </label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="email-input"
            class="w-full"
            autocomplete="off"
            formControlName="email"
          />
          <label for="email-input">E-Mail</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <p-inputmask
            id="unit-size-input"
            class="w-full"
            styleClass="w-full"
            mask="99.999.999"
            autocomplete="off"
            formControlName="dni"
          />
          <label for="unit-size-input">D.N.I</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <p-inputmask
            id="unit-size-input"
            class="w-full"
            styleClass="w-full"
            mask="99-99999999-9"
            autocomplete="off"
            formControlName="cuit"
          />
          <label for="unit-size-input">CUIT</label>
        </p-floatlabel>
      </form>

      <ng-template #footer>
        <div class="w-full flex flex-row">
          <div class="h-full flex flex-row items-center gap-2">
            <b class="text-red-400">*</b>
            Obligatorio
          </div>

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

    <p-toast position="bottom-right" />
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

  protected localitiesLoading = false;
  protected localitiesList: string[] = [];

  constructor(
    private clienteService: Client,
    private personService: Person,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(editData?: ClientResponse) {
    this.formGroup.reset();
    this.visible = true;
    this.$editData = editData;

    this.loadLocalities();

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

  private async loadLocalities() {
    try {
      const { locality } = this.formGroup.controls;

      locality.disable();
      this.localitiesLoading = true;

      const localities = await lastValueFrom(
        this.personService.getLocalities(),
      );

      locality.enable();

      this.localitiesList = localities;
      this.localitiesLoading = false;
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar las localidades',
        detail:
          'Ocurrio un error inesperado al cargar las localidades, por favor pruebe de nuevo más tarde.',
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
