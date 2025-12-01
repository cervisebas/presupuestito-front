import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Budget } from '@/common/api/services/budget';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { Dialog } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-budget-price-update',
  template: `
    <p-dialog
      header="Actualizar precios del presupuesto"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '600px' }"
    >
      <p>
        ¿Desea recalcular los precios de los materiales y actualizar el total
        del presupuesto?
      </p>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          severity="secondary"
          (onClick)="close()"
        ></p-button>

        <p-button
          label="Actualizar precios"
          severity="success"
          (onClick)="confirmUpdate()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
  imports: [Dialog, SharedModule, Button],
})
export class BudgetPriceUpdate {
  @Input() budget?: BudgetResponse;
  @Output() updated = new EventEmitter<void>();

  visible = false;

  constructor(private budgetService: Budget) {} // ← Faltaba INYECTAR el servicio

  open(budget: BudgetResponse) {
    this.budget = budget;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  confirmUpdate() {
    if (!this.budget) return;

    this.budgetService.updateItemPrices(this.budget.budgetId).subscribe({
      next: () => {
        this.updated.emit();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error al actualizar precios:', err);
        this.visible = false;
      },
    });
  }
}
