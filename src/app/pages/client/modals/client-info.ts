import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-client-info',
  imports: [Dialog, TableModule],
  providers: [CurrencyPipe],
  template: `
    <p-dialog
      header="Información del cliente"
      [modal]="true"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-3/10 min-w-[400px]"
    >
      <p-table [value]="data" class="w-full">
        <ng-template #body let-product>
          <tr>
            <td class="font-semibold underline">{{ product.label }}</td>
            <td>{{ product.value }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-dialog>
  `,
  styles: '',
})
export class ClientInfo {
  protected visible = false;
  protected data: {
    label: string;
    value: string;
  }[] = [];

  constructor(private currencyPipe: CurrencyPipe) {}

  public open(client: ClientResponse) {
    this.data = [];

    this.addValue('Nombre', client.personId.name || '-');
    this.addValue('Apellido', client.personId.lastName || '-');
    this.addValue('Calle', client.personId.street || '-');
    this.addValue('Altura', client.personId.streetNumber || '-');
    this.addValue('Localidad', client.personId.locality || '-');
    this.addValue('Telefono', client.personId.phoneNumber || '-');
    this.addValue('Email', client.personId.email || '-');
    this.addValue('DNI', client.personId.dni || '-');
    this.addValue('CUIT', client.personId.cuit || '-');

    this.visible = true;
  }

  private addValue(label: string, value: string) {
    this.data.push({
      label,
      value,
    });
  }
}
