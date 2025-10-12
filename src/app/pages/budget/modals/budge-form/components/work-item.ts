import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { BudgetStatements } from '@/pages/budget/constants/BudgetStatements';
import { SelectModule } from 'primeng/select';
import { StyleClass } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ISelectItem } from '@/common/interfaces/ISelectItem';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { IWorkFormData } from '../interfaces/IWorkFormData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work-item',
  imports: [
    SelectModule,
    FieldsetModule,
    InputTextModule,
    ReactiveFormsModule,
    AccordionModule,
    FloatLabelModule,
    InputNumber,
    DatePickerModule,
    TextareaModule,
    StyleClass,
    TableModule,
    SelectModule,
    NgClass,
    Button,
  ],
  template: `
    <form [formGroup]="formGroup" class="flex w-full">
      <p-fieldset class="w-full">
        <ng-template #header>
          <span>{{ workName }}</span>
        </ng-template>

        <p-accordion>
          <p-accordion-panel value="0" class="!border-0">
            <p-accordion-header
              [ngClass]="{
                '!bg-red-200': infoError,
                '!bg-gray-200': !infoError,
              }"
            >
              Información
              @if (infoError) {
                {{ ' (Revisar)' }}
              }
            </p-accordion-header>
            <p-accordion-content>
              <div class="w-full flex flex-col gap-4 pt-6 pb-4">
                <p-floatlabel variant="on">
                  <input
                    pInputText
                    id="work-name"
                    class="w-full"
                    maxlength="50"
                    autocomplete="off"
                    formControlName="name"
                  />
                  <label for="work-name">Nombre del trabajo</label>
                </p-floatlabel>

                <div class="flex w-full flex-row gap-4">
                  <p-floatlabel variant="on" class="w-full">
                    <p-inputnumber
                      inputId="work-estimated-hours"
                      class="w-full"
                      formControlName="estimatedHours"
                    />
                    <label for="work-estimated-hours">Horas estimadas</label>
                  </p-floatlabel>

                  <p-datepicker
                    class="w-full"
                    placeholder="Fecha limite"
                    formControlName="limitDate"
                    iconDisplay="input"
                    [showIcon]="true"
                    appendTo="body"
                  />
                </div>

                <p-floatlabel variant="on" class="w-full">
                  <textarea
                    pTextarea
                    id="work-notes"
                    rows="5"
                    cols="30"
                    class="w-full h-full resize-none"
                    formControlName="notes"
                  ></textarea>
                  <label for="work-notes">Notas</label>
                </p-floatlabel>

                <p-select
                  [options]="budgetStatements"
                  optionLabel="label"
                  optionValue="value"
                  formControlName="status"
                  placeholder="Estado"
                  appendTo="body"
                />
              </div>
            </p-accordion-content>
          </p-accordion-panel>

          <p-accordion-panel value="1" class="!border-0">
            <p-accordion-header
              [ngClass]="{
                '!bg-red-200': materialError,
                '!bg-gray-200': !materialError,
              }"
            >
              Materiales utilizados
              @if (materialError) {
                {{ ' (Revisar)' }}
              }
            </p-accordion-header>
            <p-accordion-content class="items-table">
              <div class="w-full">
                <p-table [value]="materialControls" tableStyleClass="w-full">
                  <ng-template #header>
                    <tr>
                      <th
                        class="!bg-gray-100 rounded-bl-lg !border-0 !text-gray-500 w-1/10 !text-center"
                      >
                        #
                      </th>
                      <th class="!bg-gray-100 !border-0 !text-gray-500 w-7/10">
                        Material
                      </th>
                      <th class="!bg-gray-100 !border-0 !text-gray-500 w-2/10">
                        Cantidad
                      </th>
                      <th
                        class="!bg-gray-100 rounded-br-lg !border-0 !text-gray-500 w-2/10"
                      >
                        Acciónes
                      </th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-material let-index="rowIndex">
                    <tr [formGroup]="material">
                      <td
                        class="!text-center"
                        [ngClass]="{
                          '!border-0': materialControls.length - 1 === index,
                        }"
                      >
                        {{ index + 1 }}
                      </td>
                      <td
                        [ngClass]="{
                          '!border-0': materialControls.length - 1 === index,
                        }"
                      >
                        <p-select
                          class="w-full"
                          placeholder="Seleccióne un material"
                          [options]="materials"
                          optionLabel="label"
                          optionValue="value"
                          formControlName="materialId"
                          appendTo="body"
                          [filter]="true"
                        />
                      </td>
                      <td
                        [ngClass]="{
                          '!border-0': materialControls.length - 1 === index,
                        }"
                      >
                        <p-inputnumber
                          class="w-full"
                          formControlName="quantity"
                        />
                      </td>
                      <td
                        [ngClass]="{
                          '!border-0': materialControls.length - 1 === index,
                        }"
                      >
                        <p-button
                          icon="pi pi-trash"
                          severity="danger"
                          [disabled]="materialControls.length === 1"
                          (onClick)="removeMaterial(index)"
                        />
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template #footer>
                    <tr>
                      <th colspan="4">
                        <div class="flex w-full flex-row justify-center">
                          <p-button
                            class="w-full"
                            styleClass="w-full"
                            icon="pi pi-plus"
                            label="Añadir material"
                            severity="secondary"
                            (onClick)="addMaterial()"
                          />
                        </div>
                      </th>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </p-accordion-content>
          </p-accordion-panel>
        </p-accordion>

        <p-button
          class="w-full"
          styleClass="w-full mt-5"
          icon="pi pi-plus"
          label="Eliminar trabajo"
          severity="danger"
          [disabled]="disableRemove"
          (onClick)="onRemove.emit()"
        />
      </p-fieldset>
    </form>
  `,
  styles: `
    :host {
      width: 100%;
    }

    .items-table {
      &::ng-deep {
        .p-accordioncontent-content {
          padding-inline: 0;
        }
      }
    }
  `,
})
export class WorkItem implements OnInit, OnDestroy {
  @Input({ required: true })
  public materials!: ISelectItem<number>[];

  @Input({ required: true })
  public data!: IWorkFormData;

  @Input()
  public disableRemove?: boolean;

  @Output()
  public dataChange = new EventEmitter<IWorkFormData>();

  @Output()
  public onRemove = new EventEmitter<void>();

  protected readonly budgetStatements = BudgetStatements;

  protected formGroup = new FormGroup({
    // Information
    name: new FormControl('Nombre del trabajo', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(4),
    ]),
    estimatedHours: new FormControl(0, [
      Validators.required,
      Validators.min(0),
    ]),
    limitDate: new FormControl(new Date(), [Validators.required]),
    notes: new FormControl('', []),
    status: new FormControl(this.budgetStatements.at(0)!.value, [
      Validators.required,
    ]),

    // Items
    materials: new FormArray([
      new FormGroup({
        materialId: new FormControl<number | null>(null, [Validators.required]),
        quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      }),
    ]),
  });

  private valueEvent?: Subscription;

  constructor() {}

  public ngOnInit() {
    this.setDataToForm();

    this.valueEvent = this.formGroup.valueChanges.subscribe({
      next: () => {
        this.dataChange.emit(this.getData());
      },
    });
  }

  public ngOnDestroy() {
    this.valueEvent?.unsubscribe();
  }

  private setDataToForm() {
    const { name, estimatedHours, limitDate, notes, status, materials } =
      this.formGroup.controls;

    name.setValue(this.data.name);
    estimatedHours.setValue(this.data.estimatedHours);
    limitDate.setValue(this.data.limitDate);
    notes.setValue(this.data.notes);
    status.setValue(this.data.status);

    materials.clear();

    for (const material of this.data.materials) {
      this.addMaterial(material);
    }
  }

  protected addMaterial(edit?: IWorkFormData['materials'][0]) {
    this.formGroup.controls.materials.push(
      new FormGroup({
        materialId: new FormControl<number | null>(edit?.materialId || null, [
          Validators.required,
        ]),
        quantity: new FormControl(edit?.quantity || 1, [
          Validators.required,
          Validators.min(1),
        ]),
      }),
    );
  }

  protected removeMaterial(index: number) {
    this.formGroup.controls.materials.removeAt(index);
  }

  public getData(): IWorkFormData {
    const { name, estimatedHours, limitDate, notes, status, materials } =
      this.formGroup.controls;

    return {
      name: name.value!,
      estimatedHours: estimatedHours.value!,
      limitDate: limitDate.value!,
      notes: notes.value!,
      status: status.value!,
      materials: materials.value.map((val) => ({
        materialId: val.materialId!,
        quantity: val.quantity!,
      })),
    };
  }

  protected get materialError() {
    return this.formGroup.controls.materials.invalid;
  }

  protected get infoError() {
    const { name, estimatedHours, limitDate, notes, status } =
      this.formGroup.controls;

    return (
      name.invalid ||
      estimatedHours.invalid ||
      limitDate.invalid ||
      notes.invalid ||
      status.invalid
    );
  }

  protected get workName() {
    return this.formGroup.controls.name.value || '';
  }

  protected get materialControls() {
    return this.formGroup.controls.materials.controls;
  }
}
