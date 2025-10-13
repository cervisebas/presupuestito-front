import { DialogOptionsBase } from '@/common/classes/DialogOptions';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingContainer } from '@/common/components/loading-container';
import { TableModule } from 'primeng/table';
import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { lastValueFrom } from 'rxjs';
import { Toast } from 'primeng/toast';
import { Client } from '@/common/api/services/client';
import { MessageService } from 'primeng/api';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { IClearForm } from '@/common/interfaces/IClearForm';
import { IBudgetData } from '../interfaces/IBudgetData';
import moment from 'moment';

@Component({
  selector: 'app-budget-summary',
  imports: [
    LoadingContainer,
    TableModule,
    Toast,
    DatePipe,
    CurrencyPipe,
    NgClass,
  ],
  providers: [
    {
      provide: DialogOptionsBase,
      useExisting: BudgetSummaryStep,
    },
  ],
  template: `
    <app-loading-container [loading]="!data || clientLoading">
      <div class="size-full overflow-x-auto overflow-y-scroll">
        <p-table [value]="data?.works!">
          <ng-template #header>
            <tr>
              <th colspan="100%" class="!bg-gray-300 rounded-t-lg">
                <div class="w-full flex justify-center items-center py-2">
                  <h1 class="!text-xl !m-0">
                    {{
                      client?.personId?.name + ' ' + client?.personId?.lastName
                    }}
                  </h1>
                </div>
              </th>
            </tr>
            <tr>
              <th colspan="100%" class="!bg-gray-300">
                <div class="grid grid-cols-3">
                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Fecha inicio</h1>
                    <p>
                      {{ data?.info?.dateCreated | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Fecha fin</h1>
                    <p>
                      {{ data?.info?.deadLine | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Duración</h1>
                    <p>{{ diffDays }} días</p>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th colspan="100%" class="!bg-gray-300">
                <div class="w-full flex flex-col justify-center py-1">
                  <h1 class="!text-lg !m-0">Estado</h1>
                  <p>
                    {{ data?.info?.budgetStatus }}
                  </p>
                </div>
              </th>
            </tr>
            @if (data?.info?.descriptionBudget?.length) {
              <tr>
                <th colspan="100%" class="!bg-gray-300">
                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Descripción</h1>
                    <p>
                      {{ data?.info?.descriptionBudget }}
                    </p>
                  </div>
                </th>
              </tr>
            }
          </ng-template>

          <ng-template #body let-work let-index="rowIndex">
            <tr>
              <th colspan="100%" class="!bg-gray-200">
                <div class="w-full flex flex-col justify-center pt-4">
                  <h1 class="!text-xl !text-gray-600 !m-0">{{ work.name }}</h1>
                </div>
              </th>
            </tr>

            <tr>
              <td colspan="100%" class="!bg-gray-200">
                <div class="grid grid-cols-4 !text-left">
                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-gray-600 !text-base !m-0">Horas</h1>
                    <p class="!text-gray-600 text-sm">
                      {{ work.estimatedHours }} hs
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-gray-600 !text-base !m-0">Fecha limite</h1>
                    <p class="!text-gray-600 text-sm">
                      {{ work.limitDate | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-gray-600 !text-base !m-0">Ganancias</h1>
                    <p class="!text-gray-600 text-sm">
                      {{ work.cost | currency }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-base !m-0">Estado</h1>
                    <p class="text-sm">{{ work.status }}</p>
                  </div>
                </div>
              </td>
            </tr>

            @if (work.notes.length) {
              <tr>
                <td colspan="100%" class="!bg-gray-200">
                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0 !text-gray-600">Notas</h1>
                    <p class="!text-gray-600">
                      {{ work.notes }}
                    </p>
                  </div>
                </td>
              </tr>
            }

            <tr>
              <td
                class="!bg-gray-200 !border-0 !text-gray-600 w-1/10 !text-center"
              >
                #
              </td>
              <td class="!bg-gray-200 !border-0 !text-gray-600 w-4/10">
                Material
              </td>
              <td class="!bg-gray-200 !border-0 !text-gray-600 w-2/10">
                Material usado
              </td>
              <td class="!bg-gray-200 !border-0 !text-gray-600 w-2/10">
                Precio x unidad
              </td>
              <td class="!bg-gray-200 !border-0 !text-gray-600 w-2/10">
                Precio total
              </td>
            </tr>

            @for (item of work.materials; track $index) {
              <tr>
                <td class="!text-center" [ngClass]="{ '!border-0': $last }">
                  {{ $index + 1 }}
                </td>
                <td [ngClass]="{ '!border-0': $last }">
                  {{ item.materialName }}
                  <b>x {{ item.quantity }}</b>
                </td>
                <td [ngClass]="{ '!border-0': $last }">
                  {{ item.quantityTotal }} {{ item.quantityUnit }}
                </td>
                <td [ngClass]="{ '!border-0': $last }">
                  {{ item.pricePeerUnit | currency }}
                </td>
                <td [ngClass]="{ '!border-0': $last }">
                  {{ item.priceTotal | currency }}
                </td>
              </tr>
            }
          </ng-template>

          <ng-template #footer>
            <tr>
              <td colspan="100%" class="!bg-gray-300 rounded-b-lg">
                <div class="grid grid-cols-3">
                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Gastos en materiales</h1>
                    <p>
                      {{ totalPriceMaterial | currency }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Ganancias</h1>
                    <p>
                      {{ totalPriceEarnings | currency }}
                    </p>
                  </div>

                  <div class="w-full flex flex-col justify-center py-1">
                    <h1 class="!text-lg !m-0">Total</h1>
                    <p>{{ totalPrice | currency }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>

        <div class="w-full h-[10rem]"></div>
      </div>
    </app-loading-container>

    <p-toast position="bottom-right" />
  `,
  styles: '',
})
export class BudgetSummaryStep
  implements OnInit, DialogOptionsBase, IClearForm
{
  @Input()
  public data?: IBudgetData;

  protected clientLoading = true;
  private $clientList?: ClientResponse[];

  constructor(
    private clientService: Client,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  private async loadClients() {
    try {
      this.clientLoading = true;
      const clients = await lastValueFrom(this.clientService.getClients());

      this.$clientList = clients;
    } catch (error) {
      // En caso de error de se muestra en consola lo que sucedio y se notifica al usuario.
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar los clientes',
        detail:
          'Ocurrio un error inesperado al cargar los clientes, por favor pruebe de nuevo más tarde.',
      });
    } finally {
      this.clientLoading = false;
    }
  }

  public clearForm(): void {
    this.loadClients();
  }

  protected get diffDays() {
    if (!this.data) {
      return 0;
    }

    return moment(this.data.info.deadLine).diff(
      moment(this.data.info.dateCreated),
      'days',
    );
  }

  protected get client() {
    return this.$clientList?.find(
      (client) => client.clientId === this.data?.info.clientId,
    );
  }

  protected get totalPriceMaterial() {
    if (!this.data) {
      return 0;
    }

    let price = 0;

    for (const { materials } of this.data.works) {
      for (const { priceTotal } of materials) {
        price += priceTotal ?? 0;
      }
    }

    return price;
  }

  protected get totalPriceEarnings() {
    if (!this.data) {
      return 0;
    }

    let price = 0;

    for (const { cost } of this.data.works) {
      price += cost;
    }

    return price;
  }

  protected get totalPrice() {
    return this.totalPriceEarnings + this.totalPriceMaterial;
  }

  public get dialogEnableNext() {
    return true;
  }

  public get dialogTitle() {
    return 'Resumen';
  }

  public get dialogStyle() {
    return 'w-[60rem] h-[98dvh]';
  }
}
