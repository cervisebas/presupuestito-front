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

    this.addValue('Nombre Empresa', supplier.personId.nameCompany);
    this.addValue('Calle', supplier.personId.street);
    this.addValue('Número', supplier.personId.streetNumber);
    this.addValue('Localidad', supplier.personId.locality);
    this.addValue('Teléfono ', supplier.personId.phoneNumber);
    this.addValue('E-mail', supplier.personId.email);
    this.addValue('CUIT', supplier.personId.cuit);

    this.visible = true;
  }

  private addValue(label: string, value: unknown) {
    const text = value == null ? '' : String(value);

    this.data.push({
      label,
      value: text,
    });
  }
}
