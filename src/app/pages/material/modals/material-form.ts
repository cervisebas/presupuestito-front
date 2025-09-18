import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-material-form',
  imports: [DialogModule, FloatLabelModule, InputTextModule, TextareaModule],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      header="Añadir nuevo material"
      [blockScroll]="true"
      styleClass="w-[30rem] h-[95vh] max-w-[95vw]"
    >
      <form class="flex flex-col gap-4 pt-3">
        <p-floatlabel variant="on" class="w-full">
          <input pInputText id="name-input" class="w-full" autocomplete="off" />
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
          ></textarea>

          <label for="description-input">Descripción</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="brand-input"
            class="w-full"
            autocomplete="off"
          />
          <label for="brand-input">Marca</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="color-input"
            class="w-full"
            autocomplete="off"
          />
          <label for="color-input">Color</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input pInputText id="size-input" class="w-full" autocomplete="off" />
          <label for="size-input">Medida</label>
        </p-floatlabel>

        <p-floatlabel variant="on" class="w-full">
          <input
            pInputText
            id="unit-size-input"
            class="w-full"
            autocomplete="off"
          />
          <label for="unit-size-input">Unidad de medida</label>
        </p-floatlabel>
      </form>
    </p-dialog>
  `,
})
export class MaterialForm {
  protected visible = false;
  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    size: new FormControl('', [Validators.required]),
    unitSize: new FormControl('', [Validators.required]),

    item: new FormControl('', [Validators.required]),
    subItem: new FormControl('', [Validators.required]),
  });

  public open() {
    this.formGroup.reset();
    this.visible = true;
  }
}
