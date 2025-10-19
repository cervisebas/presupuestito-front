import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PersonInfo } from '@/common/components/person-info';
import { PersonInfoItem } from '@/common/components/person-info-item';
import { DCuilPipe } from '@/common/pipes/d-cuil-pipe';
import { DDniPipe } from '@/common/pipes/d-dni-pipe';
import { PhonePipe } from '@/common/pipes/phone-pipe';

@Component({
  selector: 'app-client-info',
  imports: [
    Dialog,
    TableModule,
    PersonInfo,
    PersonInfoItem,
    DCuilPipe,
    DDniPipe,
    PhonePipe,
  ],
  providers: [CurrencyPipe],
  template: `
    <p-dialog
      header="Información del cliente"
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-3/10 min-w-[400px]"
    >
      @if ($data) {
        <app-person-info icon="pi-user" [userTitle]="title">
          @if ($data.personId.dni) {
            <app-person-info-item
              label="D.N.I"
              [value]="$data.personId.dni | dDni"
              minWidthLabel="30%"
            />
          }

          @if ($data.personId.cuit) {
            <app-person-info-item
              label="CUIT/CUIL"
              [value]="$data.personId.cuit | dCuil"
              minWidthLabel="30%"
            />
          }

          @if ($data.personId.street && $data.personId.streetNumber) {
            <app-person-info-item
              label="Dirección"
              [value]="
                $data.personId.street + ' ' + $data.personId.streetNumber
              "
              minWidthLabel="30%"
              type="address"
              [useValueAction]="address"
            />
          }

          @if ($data.personId.locality) {
            <app-person-info-item
              label="Localidad"
              [value]="$data.personId.locality"
              minWidthLabel="30%"
            />
          }

          @if ($data.personId.email) {
            <app-person-info-item
              label="E-Mail"
              [value]="$data.personId.email"
              minWidthLabel="30%"
              type="email"
            />
          }

          @if ($data.personId.phoneNumber) {
            <app-person-info-item
              label="Teléfono"
              [value]="$data.personId.phoneNumber | phone"
              minWidthLabel="30%"
              type="phone"
              [useValueAction]="$data.personId.phoneNumber"
            />
          }
        </app-person-info>
      }
    </p-dialog>
  `,
  styles: '',
})
export class ClientInfo {
  protected visible = false;

  protected $data?: ClientResponse;

  constructor() {}

  public open(client: ClientResponse) {
    this.$data = client;

    this.visible = true;
  }

  protected get address() {
    const data = this.$data?.personId;
    let address = [];

    if (data?.locality) {
      address.push(data.locality);
    }

    if (data?.street) {
      let street = data.street || '';

      if (data?.streetNumber) {
        street += street.length ? ' ' : '';
        street += data?.streetNumber;
      }

      address.push(street);
    }

    return address.join(', ');
  }

  protected get title() {
    if (!this.$data) {
      return '';
    }

    return this.$data.personId.name + ' ' + this.$data.personId.lastName;
  }
}
