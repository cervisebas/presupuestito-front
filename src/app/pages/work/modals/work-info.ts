import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { WorkResponse } from '@/common/api/interfaces/responses/WorkResponse';

@Component({
  selector: 'app-work-info',
  imports: [Dialog, TableModule],
  providers: [CurrencyPipe],
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
      <ng-template pTemplate="header">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-lg">Información del trabajo</span>
        </div>
      </ng-template>

      <div class="w-full">
        <div class="w-full flex flex-row justify-center">
          <div
            class="size-[5rem] rounded-full bg-emerald-300 flex justify-center items-center"
          >
            <i class="pi pi-hammer !text-white !text-2xl"></i>
          </div>
        </div>
      </div>
      <p-table [value]="data" class="w-full">
        <ng-template pTemplate="body" let-work>
          <tr>
            <td class="font-semibold underline">{{ work.label }}</td>
            <td>{{ work.value }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-dialog>
  `,
  styles: '',
})
export class WorkInfo {
  protected visible = false;
  protected data: {
    label: string;
    value: string;
  }[] = [];

  constructor(private currencyPipe: CurrencyPipe) {}

  public open(work: WorkResponse) {
    this.data = [];

    this.addValue('Nombre', work.workName);
    this.addValue('Estado', work.workStatus);
    this.addValue('Nro Presupuesto', work.budgetId.toString());
    this.addValue('Horas estimadas', work.estimatedHoursWorked.toString());
    this.addValue('Fecha Límite', new Date(work.deadLine).toLocaleDateString());
    this.addValue(
      'Materiales',
      work.itemsId
        .map(
          (item) =>
            `${item.oMaterial.materialName} - Cantidad: ${item.quantity}`,
        )
        .join(', ') || '-',
    );
    this.addValue('Costo', work.costPrice.toString());
    this.addValue('Notas', work.notes);

    this.visible = true;
  }

  private addValue(label: string, value: string) {
    this.data.push({
      label,
      value,
    });
  }
}
