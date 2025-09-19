import { Component } from '@angular/core';
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

@Component({
  selector: 'app-client-form',
  imports: [
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      header="Añadir nuevo cliente"
      [blockScroll]="true"
      styleClass="w-[30rem] h-[95vh] max-w-[95vw]"
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
    </p-dialog>
  `,
})
export class ClientForm {
  protected visible = true;
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

  public open() {
    this.formGroup.reset();
    this.visible = true;
  }
}
