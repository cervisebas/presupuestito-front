import { DialogOptionsBase } from '@/common/classes/DialogOptions';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { CalculateBudget } from '@/pages/budget/services/calculate-budget';
import { isInvalidDate } from '@/common/utils/isInvalidDate';

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
      <div
        #element
        [ngClass]="{
          'size-full overflow-x-auto overflow-y-scroll': enableScroll,
        }"
      >
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
                      @if (
                        data?.info?.deadLine &&
                        !isInvalidDate(data?.info?.deadLine!)
                      ) {
                        {{ data?.info?.deadLine | date: 'dd/MM/yyyy' }}
                      } @else {
                        {{ '-' }}
                      }
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
                    <h1 class="!text-gray-600 !text-base !m-0">Estado</h1>
                    <p class="!text-gray-600 text-sm">{{ work.status }}</p>
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
  @ViewChild('element')
  private element?: ElementRef<HTMLDivElement>;

  @Input()
  public data?: IBudgetData;

  @Input()
  public enableScroll = true;

  protected clientLoading = true;
  private $clientList?: ClientResponse[];

  protected readonly isInvalidDate = isInvalidDate;

  constructor(
    private clientService: Client,
    private messageService: MessageService,
    private calculateBudget: CalculateBudget,
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

  public getElement() {
    return this.element?.nativeElement;
  }

  protected get diffDays() {
    if (!this.data) {
      return 0;
    }

    if (!this.data.info?.deadLine || isInvalidDate(this.data.info.deadLine)) {
      return '∞';
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

    return this.calculateBudget.getTotalPriceMaterial(this.data);
  }

  protected get totalPriceEarnings() {
    if (!this.data) {
      return 0;
    }

    return this.calculateBudget.getTotalPriceEarnings(this.data);
  }

  protected get totalPrice() {
    if (!this.data) {
      return 0;
    }

    return this.calculateBudget.getTotalPrice(this.data);
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
