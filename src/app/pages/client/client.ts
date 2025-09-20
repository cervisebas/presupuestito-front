import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { Client } from '@/common/api/services/client';
import { LoadingContainer } from '@/common/components/loading-container';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DebounceInput } from '@/common/directives/debounce-input';
import { ArraySearch } from '@/common/services/array-search';
import { ClientForm } from './modals/client-form';

@Component({
  selector: 'app-dashboard',
  imports: [
    Button,
    InputIcon,
    IconField,
    TableModule,
    DebounceInput,
    InputTextModule,
    LoadingContainer,
    ClientForm,
  ],
  template: `
    <app-loading-container [loading]="loading" [error]="error">
      <div
        class="px-5 pb-4 pt-4 flex flex-row justify-between items-center bg-(--p-paginator-background) rounded-t-(--p-paginator-border-radius) gap-4"
      >
        <p-iconfield class="w-full md:max-w-[300px]">
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            debounceInput
            type="search"
            class="w-full"
            placeholder="Buscar"
            [enableDebounce]="true"
            (onDebounce)="onSearch($event)"
          />
        </p-iconfield>

        <p-button
          label="Añadir"
          icon="pi pi-plus"
          (onClick)="clientForm?.open()"
        />
      </div>

      <p-table
        [value]="clientData"
        [paginator]="true"
        [rows]="20"
        size="large"
        [tableStyle]="{ 'min-width': '60rem' }"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="name" style="width: 20%">
              <div class="flex items-center gap-2">
                Nombre
                <p-sortIcon field="name" />
              </div>
            </th>
            <th pSortableColumn="lastname" style="width: 20%">
              <div class="flex items-center gap-2">
                Apellido
                <p-sortIcon field="lastname" />
              </div>
            </th>
            <th pSortableColumn="phoneNumber" style="width: 20%">
              <div class="flex items-center gap-2">
                Telefono
                <p-sortIcon field="phoneNumber" />
              </div>
            </th>
            <th style="width: 20%">
              <div class="flex items-center gap-2">Acciónes</div>
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-client>
          <tr>
            <td>{{ client.personId.name }}</td>
            <td>{{ client.personId.lastname }}</td>
            <td>{{ client.personId.phoneNumber }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                />
                <p-button
                  icon="pi pi-pencil"
                  severity="warn"
                  aria-label="Editar"
                  (onClick)="clientForm?.open(client)"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  aria-label="Eliminar"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <app-client-form (reloadTable)="loadData()" />
  `,
})
export class ClientPage implements OnInit {
  protected error = null;
  protected loading = true;
  protected $clientData: ClientResponse[] = [];
  protected clientData: ClientResponse[] = [];

  @ViewChild(ClientForm)
  protected clientForm?: ClientForm;

  constructor(
    private client: Client,
    private arraySearch: ArraySearch,
  ) {}

  public ngOnInit() {
    this.loadData();
  }

  protected onSearch(event: string) {
    this.clientData = this.arraySearch.search(
      this.$clientData,
      [
        'name',
        'lastname',
        'street',
        'streetNumber',
        'locality',
        'phoneNumber',
        'email',
        'dni',
        'cuit',
      ],
      event,
    );
  }

  protected loadData() {
    this.error = null;
    this.loading = true;

    this.client.getClients().subscribe({
      next: (client: ClientResponse[]) => {
        this.$clientData = [...client];
        this.clientData = client;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
