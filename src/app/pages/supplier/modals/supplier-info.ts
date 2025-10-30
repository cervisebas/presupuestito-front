import { SupplierResponse } from '@/common/api/interfaces/responses/SupplierResponse';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PersonInfo } from '@/common/components/person-info';
import { PersonInfoItem } from '@/common/components/person-info-item';
import { PhonePipe } from '@/common/pipes/phone-pipe';
import { DCuilPipe } from '@/common/pipes/d-cuil-pipe';

@Component({
  selector: 'app-supplier-info',
  imports: [
    Dialog,
    TableModule,
    PersonInfo,
    PersonInfoItem,
    DCuilPipe,
    PhonePipe,
  ],
  template: `
    <p-dialog
      header="Información del proveedor"
      [modal]="true"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-[30rem]"
    >
      @if ($data) {
        <app-person-info
          icon="pi-building"
          [userTitle]="$data.personId.nameCompany"
        >
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
export class SupplierInfo {
  protected visible = false;
  protected $data?: SupplierResponse;
  protected data: {
    label: string;
    value: string;
  }[] = [];

  constructor() {}

  public open(supplier: SupplierResponse) {
    this.$data = supplier;
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
}
