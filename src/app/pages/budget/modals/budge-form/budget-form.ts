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
      <swiper [disabled]="true">
        <swiper-slide name="information">
          <app-bugde-information dialogOptions />
        </swiper-slide>

        <swiper-slide name="add-works">
          <app-add-works dialogOptions />
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
                label="Guardar"
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

    <p-toast />
  `,
})
export class BudgetForm {
  @ViewChild(SwiperComponent)
  private swiper?: SwiperComponent;

  @ViewChildren(DialogOptionsDirective)
  private dialogOptions?: QueryList<DialogOptionsDirective>;

  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;

  protected saveData() {
    // TODO: Implement this
  }

  public open(budget?: BudgetResponse) {
    this.swiper?.toPage(0);
    this.visible = true;
  }

  protected prevStep() {
    this.swiper?.prevPage();
  }

  protected nextStep() {
    this.swiper?.nextPage();
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
    let titleBase = 'Nuevo presupuesto';
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
}
