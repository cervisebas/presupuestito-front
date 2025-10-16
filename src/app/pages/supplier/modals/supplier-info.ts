import { SupplierResponse } from '@/common/api/interfaces/responses/SupplierResponse';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-supplier-info',
  imports: [Dialog, TableModule],
  providers: [CurrencyPipe],
  template: `
    <p-dialog
      header="Información del proveedor"
      [modal]="true"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-3/10 min-w-[400px]"
    >
      <p-table [value]="data" class="w-full">
        <ng-template #body let-supplier>
          <tr>
            <td class="font-semibold underline">{{ supplier.label }}</td>
            <td>{{ supplier.value }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-dialog>
  `,
  styles: '',
})
export class SupplierInfo {
  protected visible = false;
  protected data: {
    label: string;
    value: string;
  }[] = [];

  constructor(private currencyPipe: CurrencyPipe) {}

  public open(supplier: SupplierResponse) {
    this.data = [];

    this.addValue('Nombre', supplier.personId.name);
    this.addValue('Apellido', supplier.personId.lastName);
    this.addValue('Calle', supplier.personId.street);
    this.addValue('Altura', supplier.personId.streetNumber);
    this.addValue('Localidad', supplier.personId.locality);
    this.addValue('Telefono', supplier.personId.phoneNumber);
    this.addValue('Email', supplier.personId.email);
    this.addValue('DNI', supplier.personId.dni);
    this.addValue('CUIT', supplier.personId.cuit);

    this.visible = true;
  }

  private addValue(label: string, value: string) {
    this.data.push({
      label,
      value,
    });
  }
}
