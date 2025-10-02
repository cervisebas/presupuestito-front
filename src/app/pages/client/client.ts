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
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '@/common/services/loading';
import { DevService } from '@/common/services/dev-service';
import { ClientInfo } from './modals/client-info';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

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
    ClientInfo,
    ConfirmDialog,
    Toast,
  ],
  providers: [ConfirmationService, MessageService],
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
            <td>{{ client.personId?.name || '-' }}</td>
            <td>{{ client.personId?.lastname || '-' }}</td>
            <td>{{ client.personId?.phoneNumber || '-' }}</td>
            <td>
              <div class="flex flex-row gap-4">
                <p-button
                  icon="pi pi-info-circle"
                  severity="info"
                  aria-label="Información"
                  (onClick)="clientInfo?.open(client)"
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
                  (onClick)="deleteClient($event, client)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-loading-container>

    <p-confirmdialog styleClass="max-w-9/10" />
    <p-toast position="bottom-right" />

    <app-client-info />
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

  @ViewChild(ClientInfo)
  protected clientInfo?: ClientInfo;

  protected tableHeaderItems = [
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'lastname',
      label: 'Apellido',
    },
    {
      key: 'phoneNumber',
      label: 'Telefono',
    },
    {
      key: null,
      label: 'Acciónes',
    },
  ];

  constructor(
    private client: Client,
    private arraySearch: ArraySearch,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    protected devService: DevService,
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

  protected deleteClient(event: Event, client: ClientResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro/a que desea eliminar el cliente "${client.personId.name}"? Esta acción no se prodra deshacer.`,
      header: 'Confirme eliminación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.loadingService.setLoading(true);
        this.client.deleteClient(client.clientId).subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'info',
              summary: 'Cliente eliminado',
              detail: `Se elimino correctamente el cliente "${client.personId.name}".`,
            });
            this.loadData();
          },
          error: (error) => {
            console.error(error);
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar cliente',
              detail:
                'Ocurrio un error inesperado al eliminar el cliente, por favor pruebe de nuevo más tarde.',
            });
          },
        });
      },
    });
  }
}
