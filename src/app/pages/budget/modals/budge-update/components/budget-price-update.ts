import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Budget } from '@/common/api/services/budget';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { Dialog } from 'primeng/dialog';
import { MessageService, SharedModule } from 'primeng/api';
import { Button } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '@/common/services/loading';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-budget-price-update',
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      header="Actualizar precios del presupuesto"
      styleClass="w-[30rem] h-max max-w-[95vw]"
      contentStyleClass="size-full"
    >
      <p class="m-0">
        ¿Desea recalcular los precios de los materiales y actualizar el total
        del presupuesto?
      </p>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="close()" />

        <p-button label="Actualizar precios" (onClick)="confirmUpdate()" />
      </ng-template>
    </p-dialog>

    <p-toast position="bottom-right" />
  `,
  imports: [Dialog, SharedModule, Button, ToastModule],
})
export class BudgetPriceUpdate {
  @Input()
  public budget?: BudgetResponse;

  @Output()
  public reloadTable = new EventEmitter<void>();

  protected visible = false;

  constructor(
    private budgetService: Budget,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  public open(budget: BudgetResponse) {
    this.budget = budget;
    this.visible = true;
  }

  public close() {
    this.visible = false;
  }

  protected async confirmUpdate() {
    if (!this.budget) return;
    this.visible = false;
    this.loadingService.setLoading(true);

    try {
      await lastValueFrom(
        this.budgetService.updateItemPrices(this.budget.budgetId),
      );

      this.messageService.add({
        severity: 'success',
        summary: '¡Presupuesto actualizado!',
        detail:
          'Se actualizo el precio de los materiales y presupuesto correctamente.',
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al actualizar el presupuesto',
        detail:
          'Ocurrio un error innesperado al actualizar los valores del presupuesto, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.loadingService.setLoading(false);
      this.reloadTable.emit();
    }
  }
}
