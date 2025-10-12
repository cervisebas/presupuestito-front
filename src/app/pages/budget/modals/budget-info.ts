import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BudgetSummaryStep } from './budge-form/steps/budget-summary';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { IBudgetData } from './budge-form/interfaces/IBudgetData';
import { TransformDataBudget } from './budge-form/services/transform-data-budget';

@Component({
  selector: 'app-budget-info',
  imports: [Dialog, TableModule, BudgetSummaryStep],
  providers: [BudgetSummaryStep],
  template: `
    <p-dialog
      header="Información del presupuesto"
      [modal]="true"
      [(visible)]="visible"
      styleClass="max-w-[95dvw] max-h-[95dvh] w-[60rem] h-[98dvh]"
      contentStyleClass="size-full"
    >
      @if (data) {
        <app-budget-summary [data]="data" />
      }
    </p-dialog>
  `,
  styles: '',
})
export class BudgetInfo {
  protected visible = false;
  protected data?: IBudgetData;

  constructor(private transformDataBudget: TransformDataBudget) {}

  public open(budget: BudgetResponse) {
    this.data = this.transformDataBudget.transform(budget);
    this.visible = true;
  }
}
