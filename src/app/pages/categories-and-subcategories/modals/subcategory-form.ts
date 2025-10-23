import { CategoryResponse } from '@/common/api/interfaces/responses/CategoryResponse';
import { Subcategory } from '@/common/api/services/subcategory';
import { LoadingService } from '@/common/services/loading';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-subcategory-form',
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
      header="Añadir nuevo sub-rubro"
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
export class SubcategoryForm {
  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;
  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  private $category?: CategoryResponse;

  constructor(
    private subCategoryService: Subcategory,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public async open(category: CategoryResponse) {
    this.formGroup.reset();
    this.$category = category;
    this.visible = true;
  }

  protected async saveData() {
    try {
      this.loadingService.setLoading(true);

      const { name } = this.formGroup.value;

      await lastValueFrom(
        this.subCategoryService.createSubcategory({
          subCategoryName: name!,
          categoryId: this.$category?.categoryId!,
        }),
      );

      this.visible = false;
      this.reloadTable.emit();
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear el sub-rubro',
        detail:
          'Ocurrio un error inesperado al crear el sub-rubro, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }
}
