import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { WorkResponse } from '@/common/api/interfaces/responses/WorkResponse';
import { PersonInfo } from '@/common/components/person-info';
import { PersonInfoItem } from '@/common/components/person-info-item';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-info',
  imports: [
    Dialog,
    TableModule,
    PersonInfo,
    PersonInfoItem,
    DatePipe,
    CurrencyPipe,
    Button,
  ],
  template: `
    <p-dialog
      header="Información del trabajo"
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-3/10 min-w-[400px]"
    >
      @if (data) {
        <app-person-info icon="pi-hammer" [userTitle]="data.workName">
          <app-person-info-item
            label="Estado"
            [minWidthLabel]="minWidthLabelItem"
            [value]="data.workStatus"
          />
          <app-person-info-item
            label="Horas estimadas"
            [minWidthLabel]="minWidthLabelItem"
            [value]="data.estimatedHoursWorked + ' hs'"
          />
          <app-person-info-item
            label="Fecha limite"
            [minWidthLabel]="minWidthLabelItem"
            [value]="(data.deadLine | date: 'dd/MM/yyyy') || ''"
          />
          <app-person-info-item
            label="Cantidad de materiales"
            [minWidthLabel]="minWidthLabelItem"
            [value]="data.itemsId.length"
          />
          <app-person-info-item
            label="Costo"
            [minWidthLabel]="minWidthLabelItem"
            [value]="data.costPrice | currency"
          />
          <app-person-info-item
            label="Notas"
            [minWidthLabel]="minWidthLabelItem"
            [value]="data.notes"
          />
        </app-person-info>
      }

      <ng-template #footer>
        <div class="flex w-full justify-end gap-2">
          <p-button label="Ver presupuesto" (onClick)="showBudget()" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: '',
})
export class WorkInfo {
  protected visible = false;
  protected data?: WorkResponse;

  protected readonly minWidthLabelItem = '40%';

  constructor(private router: Router) {}

  public open(work: WorkResponse) {
    this.data = work;
    this.visible = true;
  }

  protected showBudget() {
    this.router.navigate(['/budgets'], {
      state: {
        budgetId: this.data?.budgetId,
      },
    });
  }
}
