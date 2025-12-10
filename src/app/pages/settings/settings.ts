import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { LoadingService } from '@/common/services/loading';
import { Settings } from '@/common/api/services/settings';
import { lastValueFrom } from 'rxjs';
import { SettingField } from './constants/SettingField';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import moment from 'moment';

@Component({
  selector: 'app-settings',
  imports: [
    PanelModule,
    FloatLabel,
    InputNumber,
    Fluid,
    ReactiveFormsModule,
    Button,
    FormsModule,
  ],
  template: `
    @if (formGroup) {
      <form [formGroup]="formGroup" class="flex flex-col gap-4">
        <p-panel header="Costos">
          <p class="!m-0">
            <b class="text-blue-400">*</b>
            {{ ' ' }}
            Campo no modificables
          </p>
        </p-panel>

        <p-panel header="Costos">
          <div class="pt-2">
            <div class="flex-1 flex flex-col gap-4">
              <div class="flex-auto w-full max-w-[30rem]">
                <label class="mb-2 block font-bold" for="work-hours">
                  Horas laborales
                </label>
                <p-inputnumber
                  [showButtons]="true"
                  inputId="work-hours"
                  class="w-full"
                  mode="decimal"
                  [showButtons]="true"
                  [formControlName]="SettingFields.WORK_HOURS"
                  [min]="0"
                  [max]="24"
                  [minFractionDigits]="1"
                  [maxFractionDigits]="2"
                />
              </div>

              <div class="flex-auto w-full max-w-[30rem]">
                <label class="mb-2 block font-bold" for="work-cost">
                  Costo fijo por hora
                </label>
                <p-inputnumber
                  [showButtons]="true"
                  inputId="work-cost"
                  class="w-full"
                  mode="decimal"
                  [showButtons]="true"
                  [formControlName]="SettingFields.HOUR_COST"
                  [min]="0"
                  [minFractionDigits]="1"
                  [maxFractionDigits]="2"
                />
              </div>

              <div class="flex-auto w-full max-w-[30rem]">
                <label class="mb-2 block font-bold" for="work-hours">
                  Costo fijo por día
                  <b class="text-blue-400">*</b>
                </label>
                <p-inputnumber
                  [showButtons]="true"
                  inputId="work-hours"
                  class="w-full"
                  mode="decimal"
                  [ngModel]="costByDay"
                  [ngModelOptions]="{ standalone: true }"
                  [contentEditable]="false"
                  [showButtons]="false"
                  [readonly]="true"
                />
              </div>

              <div class="flex-auto w-full max-w-[30rem]">
                <label class="mb-2 block font-bold" for="work-hours">
                  Costo fijo por semana
                  <b class="text-blue-400">*</b>
                </label>
                <p-inputnumber
                  [showButtons]="true"
                  inputId="work-hours"
                  class="w-full"
                  mode="decimal"
                  [ngModel]="costByWeek"
                  [ngModelOptions]="{ standalone: true }"
                  [contentEditable]="false"
                  [showButtons]="false"
                  [readonly]="true"
                />
              </div>

              <div class="flex-auto w-full max-w-[30rem]">
                <label class="mb-2 block font-bold" for="work-hours">
                  Costo fijo por mes
                  <b class="text-blue-400">*</b>
                </label>
                <p-inputnumber
                  [showButtons]="true"
                  inputId="work-hours"
                  class="w-full"
                  mode="decimal"
                  [ngModel]="costByMonth"
                  [ngModelOptions]="{ standalone: true }"
                  [contentEditable]="false"
                  [showButtons]="false"
                  [readonly]="true"
                />
              </div>
            </div>
          </div>
        </p-panel>

        <div class="w-full flex justify-center mt-3">
          <p-button label="Guardar" icon="pi pi-save" (onClick)="saveAll()" />
        </div>
      </form>
    }
  `,
  styles: '',
})
export class SettingsPage implements OnInit {
  protected readonly SettingFields = SettingField;
  protected readonly SettingFieldValue: string[] = [];
  protected formGroup?: FormGroup<Record<string, FormControl<string | null>>>;

  private $formValues: Record<string, string> = {};

  constructor(
    private loadingService: LoadingService,
    private settingService: Settings,
    private formBuilder: FormBuilder,
  ) {
    this.SettingFieldValue = Object.values(SettingField);
  }

  ngOnInit() {
    this.makeForm();
    this.loadFormValues();
  }

  private makeForm() {
    const controls: Record<string, FormControl<string | null>> = {};

    for (const setting of this.SettingFieldValue) {
      controls[setting] = this.formBuilder.control('', [Validators.required]);
    }

    this.formGroup = this.formBuilder.group(controls);
  }

  private async loadFormValues() {
    this.loadingService.setLoading(true);

    const values: typeof this.$formValues = {};

    for (const setting of this.SettingFieldValue) {
      let $value = '';

      try {
        const { value } = await lastValueFrom(
          this.settingService.getValue(setting),
        );

        $value = value;
      } catch (error) {
        console.error(error);
      } finally {
        Object.assign(values, {
          [setting]: $value,
        });
        this.formGroup?.patchValue({
          [setting]: $value,
        });
      }
    }

    this.$formValues = values;
    this.loadingService.setLoading(false);
  }

  private async setValue(key: string, value: string) {
    try {
      await lastValueFrom(this.settingService.setValue(key, value));
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  protected async saveAll() {
    if (!this.formGroup) {
      return;
    }

    const saveValues: typeof this.$formValues = {};
    const formKeys = Object.keys(this.formGroup.value);

    for (const key of formKeys) {
      const saveValue = this.$formValues[key];
      const formValue = this.formGroup.get(key)?.value;

      if (formValue !== undefined && saveValue !== formValue) {
        Object.assign(saveValues, {
          [key]: formValue,
        });
      }
    }

    try {
      this.loadingService.setLoading(true);

      await Promise.all(
        Object.entries(saveValues).map(([key, value]) =>
          this.setValue(key, value),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
      this.loadFormValues();
    }
  }

  protected get costByDay() {
    const hoursByDay = this.formGroup?.get(SettingField.WORK_HOURS)?.value;
    const costByHour = this.formGroup?.get(SettingField.HOUR_COST)?.value;

    if (!hoursByDay || !costByHour) {
      return '0';
    }

    return String(Number(hoursByDay) * Number(costByHour));
  }

  protected get costByWeek() {
    return Number(this.costByDay) * 7;
  }

  protected get costByMonth() {
    return Number(this.costByDay) * moment().daysInMonth();
  }
}
