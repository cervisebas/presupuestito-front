import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { Category } from '@/common/api/services/category';
import { LoadingService } from '@/common/services/loading';
import { lastValueFrom } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-category-form',
  imports: [
    Dialog,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    Button,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      header="Añadir nuevo rubro"
      [blockScroll]="false"
      styleClass="w-[30rem] h-max max-w-[95vw]"
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
          <label for="name-input">
            Nombre
            <b class="text-red-400">*</b>
          </label>
        </p-floatlabel>
      </form>

      <ng-template #footer>
        <div class="w-full flex flex-row">
          <div class="h-full flex flex-row items-center gap-2">
            <b class="text-red-400">*</b>
            Obligatorio
          </div>

          <div class="flex flex-1 justify-end gap-2">
            <p-button
              label="Guardar"
              [disabled]="formGroup.invalid"
              (onClick)="saveData()"
            />
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class CategoryForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;
  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private categoryService: Category,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open() {
    this.formGroup.reset();
    this.visible = true;
  }

  protected async saveData() {
    try {
      this.loadingService.setLoading(true);

      const { name } = this.formGroup.value;

      await lastValueFrom(
        this.categoryService.createCategory({
          CategoryName: name!,
        }),
      );

      this.visible = false;
      this.reloadTable.emit();
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear el rubro',
        detail:
          'Ocurrio un error inesperado al crear el rubro, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }
}
