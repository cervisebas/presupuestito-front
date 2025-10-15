import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BudgetSummaryStep } from '../budge-form/steps/budget-summary';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { IBudgetData } from '../budge-form/interfaces/IBudgetData';
import { TransformDataBudget } from '../budge-form/services/transform-data-budget';
import { BudgetClientInfo } from './components/budget-client-info';
import { TabsModule } from 'primeng/tabs';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-info',
  imports: [
    Dialog,
    TableModule,
    BudgetSummaryStep,
    BudgetClientInfo,
    TabsModule,
    Button,
    Checkbox,
    FormsModule,
  ],
  providers: [BudgetSummaryStep],
  template: `
    <p-dialog
      header="Información del presupuesto"
      [modal]="true"
      [(visible)]="visible"
      styleClass="max-w-[95dvw] max-h-[95dvh] w-[60rem] h-[98dvh] overflow-hidden"
      contentStyleClass="size-full !p-0"
    >
      @if (data) {
        <p-tabs [(value)]="tabValue" class="size-full overflow-auto">
          <div class="sticky top-0 z-10">
            <p-tablist class="min-h-[48px]">
              <p-tab [value]="SummaryTabName">Vista resumida</p-tab>
              <p-tab [value]="BudgetTabName">Vista presupuesto</p-tab>
            </p-tablist>
          </div>
          <p-tabpanels>
            <p-tabpanel [value]="SummaryTabName">
              <app-budget-summary [data]="data" [enableScroll]="false" />
            </p-tabpanel>
            <p-tabpanel [value]="BudgetTabName">
              <app-budget-client-info
                [data]="data"
                [separateByWork]="separateByWork"
              />
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      }

      <ng-template #footer>
        <div class="w-full flex flex-row pt-3">
          @if (tabValue === BudgetTabName) {
            <div class="px-4 flex flex-row items-center gap-3">
              <p-checkbox
                inputId="budget-separate-by-work"
                [(ngModel)]="separateByWork"
                [binary]="true"
              />
              <label for="budget-separate-by-work" class="select-none">
                Separar por trabajo
              </label>
            </div>
          }
          <div class="flex flex-1 justify-end gap-2">
            <p-button label="Imprimir" severity="secondary" />

            <p-button label="Descargar" />
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: '',
})
export class BudgetInfo {
  protected visible = false;
  protected data?: IBudgetData;

  protected readonly SummaryTabName = 'summary';
  protected readonly BudgetTabName = 'budget';

  protected tabValue = this.SummaryTabName;
  protected separateByWork = false;

  constructor(private transformDataBudget: TransformDataBudget) {}

  public open(budget: BudgetResponse) {
    this.data = this.transformDataBudget.transform(budget);
    this.visible = true;
  }
}
