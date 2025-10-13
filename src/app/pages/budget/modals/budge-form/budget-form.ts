import {
  Component,
  EventEmitter,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SwiperComponent } from '@/common/components/swiper.component';
import { SwiperPageComponent } from '@/common/components/swiper-page.component';
import { BudgetInformationStep } from './steps/budget-information';
import { DialogOptionsDirective } from '@/common/directives/dialog-options';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { AddWorkStep } from './steps/add-works';
import { BudgetSummaryStep } from './steps/budget-summary';
import { IBudgetData } from './interfaces/IBudgetData';
import { LoadingService } from '@/common/services/loading';
import { SendBudgetService } from './services/send-budget';
import { TransformDataBudget } from './services/transform-data-budget';

@Component({
  selector: 'app-budget-form',
  imports: [
    DialogModule,
    ToastModule,
    ButtonModule,
    SwiperComponent,
    SwiperPageComponent,
    BudgetInformationStep,
    DialogOptionsDirective,
    AddWorkStep,
    BudgetSummaryStep,
  ],
  providers: [MessageService],
  template: `
    <p-dialog
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      [header]="dialogTitleHeader"
      [blockScroll]="false"
      [styleClass]="dialogStyleClass"
      contentStyleClass="size-full"
    >
      <swiper [disabled]="true" (indexChange)="onLastStep($event)">
        <swiper-slide name="information">
          <app-bugde-information dialogOptions />
        </swiper-slide>

        <swiper-slide name="add-works">
          <app-add-works dialogOptions />
        </swiper-slide>

        <swiper-slide name="summary">
          <app-budget-summary dialogOptions [data]="data" />
        </swiper-slide>
      </swiper>

      <ng-template #footer>
        <div class="w-full flex flex-row">
          <div class="flex flex-1 justify-end gap-2">
            <p-button
              label="Volver"
              severity="secondary"
              [disabled]="!dialogEnablePrev"
              (onClick)="prevStep()"
            />

            @if (finalStep) {
              <p-button
                [label]="isEditing ? 'Actualizar' : 'Guardar'"
                [disabled]="!dialogEnableNext"
                (onClick)="saveData()"
              />
            } @else {
              <p-button
                label="Siguiente"
                [disabled]="!dialogEnableNext"
                (onClick)="nextStep()"
              />
            }
          </div>
        </div>
      </ng-template>
    </p-dialog>

    <p-toast position="bottom-right" />
  `,
})
export class BudgetForm {
  @ViewChild(SwiperComponent)
  private swiper?: SwiperComponent;

  @ViewChildren(DialogOptionsDirective)
  private dialogOptions?: QueryList<DialogOptionsDirective>;

  @ViewChild(BudgetInformationStep)
  private budgetInformationStep?: BudgetInformationStep;

  @ViewChild(AddWorkStep)
  private addWorkStep?: AddWorkStep;

  @ViewChild(BudgetSummaryStep)
  private budgetSummaryStep?: BudgetSummaryStep;

  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;

  protected data?: IBudgetData;
  protected editData?: IBudgetData;

  constructor(
    private loadingService: LoadingService,
    private messageService: MessageService,
    private sendBudget: SendBudgetService,
    private transformDataBudget: TransformDataBudget,
  ) {}

  protected async saveData() {
    if (!this.data) {
      return;
    }

    try {
      this.loadingService.setLoading(true);

      if (this.editData) {
        await this.sendBudget.edit(
          this.transformDataBudget.editMergeData(this.editData, this.data),
        );
      } else {
        await this.sendBudget.create(this.data);
      }

      this.visible = false;
      this.messageService.add({
        severity: 'success',
        summary: `Presupuesto ${this.isEditing ? 'editado' : 'creado'}!`,
        detail: `Se ${this.isEditing ? 'edito' : 'creo'} el presupuesto correctamente.`,
      });

      this.reloadTable.emit();
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Error al ${this.isEditing ? 'editar' : 'crear'} presupuesto`,
        detail: `Ocurrio un error inesperado al ${this.isEditing ? 'editar' : 'crear'} el presupuesto, por favor pruebe de nuevo más tarde.`,
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  public open(budget?: BudgetResponse) {
    this.swiper?.toPage(0);

    this.budgetInformationStep?.clearForm();
    this.addWorkStep?.clearForm();
    this.budgetSummaryStep?.clearForm();

    if (budget) {
      this.editData = this.transformDataBudget.transform(budget);
      this.budgetInformationStep?.setData(structuredClone(this.editData.info));
      this.addWorkStep?.setData(structuredClone(this.editData.works));
    }

    this.visible = true;
  }

  protected prevStep() {
    this.swiper?.prevPage();
  }

  protected nextStep() {
    this.swiper?.nextPage();
  }

  protected onLastStep(index: number) {
    if (this.swiper?.pages?.at(index)?.name === 'summary') {
      this.data = {
        info: this.budgetInformationStep?.getData()!,
        works: this.addWorkStep?.getData()!,
      };
    }
  }

  protected get dialogEnablePrev() {
    return this.swiper?.availableToPrev();
  }

  protected get dialogEnableNext() {
    if (this.swiper && this.dialogOptions) {
      return (
        this.dialogOptions?.get(this.swiper?.index)?.getDialogEnableNext() ||
        false
      );
    }

    return false;
  }

  protected get dialogTitleHeader() {
    let titleBase = this.isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto';
    const optionTitle = this.dialogOptions
      ?.get(this.swiper?.index || 0)
      ?.getDialogTitle();

    if (optionTitle) {
      titleBase = `${titleBase}: ${optionTitle}`;
    }

    return titleBase;
  }

  protected get dialogStyleClass() {
    let stylesBase =
      'w-[30rem] max-w-[95dvw] max-h-[95dvh] transition-all delay-150 duration-300 ease-in-out';
    const optionStyles = this.dialogOptions
      ?.get(this.swiper?.index || 0)
      ?.getDialogStyles();

    if (optionStyles) {
      stylesBase += ` ${optionStyles}`;
    }

    return stylesBase;
  }

  protected get finalStep() {
    return !this.swiper?.availableToNext();
  }

  protected get isEditing() {
    return Boolean(this.editData);
  }
}
