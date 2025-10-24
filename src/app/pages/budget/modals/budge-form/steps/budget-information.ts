import { ClientResponse } from '@/common/api/interfaces/responses/ClientResponse';
import { Client } from '@/common/api/services/client';
import { BudgetStatements } from '@/pages/budget/constants/BudgetStatements';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { lastValueFrom } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ISelectItem } from '@/common/interfaces/ISelectItem';
import { DialogOptionsBase } from '@/common/classes/DialogOptions';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { ISteapForm } from '../interfaces/ISteapForm';
import { BudgetRequest } from '@/common/api/interfaces/requests/BudgetRequest';
import { IClearForm } from '@/common/interfaces/IClearForm';
import { FloatLabelModule } from 'primeng/floatlabel';
import moment from 'moment';

@Component({
  selector: 'app-bugde-information',
  imports: [
    Select,
    Toast,
    DatePickerModule,
    FluidModule,
    TextareaModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  providers: [
    {
      provide: DialogOptionsBase,
      useExisting: BudgetInformationStep,
    },
  ],
  template: `
    <form [formGroup]="formGroup" class="flex flex-col gap-4 pt-3 h-full">
      <p-floatlabel class="w-full" variant="on">
        <p-select
          class="w-full"
          [options]="clientList"
          [loading]="clientLoading"
          optionLabel="label"
          optionValue="value"
          formControlName="client"
          [filter]="true"
          appendTo="body"
          inputId="budget-client"
        />
        <label for="budget-client">
          Seleccióne un cliente
          <b class="text-red-400">*</b>
        </label>
      </p-floatlabel>

      <p-floatlabel class="w-full" variant="on">
        <p-datepicker
          class="w-full"
          inputId="budget-start-data"
          formControlName="startDate"
          iconDisplay="input"
          [showIcon]="true"
          dateFormat="dd/mm/yy"
          appendTo="body"
        />
        <label for="budget-start-data">
          Fecha inicio
          <b class="text-red-400">*</b>
        </label>
      </p-floatlabel>

      <p-floatlabel class="w-full" variant="on">
        <p-datepicker
          class="w-full"
          inputId="budget-end-data"
          formControlName="endDate"
          iconDisplay="input"
          [showIcon]="true"
          dateFormat="dd/mm/yy"
          appendTo="body"
        />
        <label for="budget-end-data">
          Fecha limite
          <b class="text-red-400">*</b>
        </label>
      </p-floatlabel>

      <p-floatlabel class="w-full" variant="on">
        <textarea
          id="budget-description"
          rows="5"
          cols="30"
          pTextarea
          autoResize="false"
          class="w-full resize-none"
          formControlName="description"
        ></textarea>
        <label for="budget-description">Descripción</label>
      </p-floatlabel>

      <p-floatlabel class="w-full" variant="on">
        <p-select
          class="w-full"
          inputId="budget-status"
          [options]="budgetStatements"
          optionLabel="label"
          optionValue="value"
          formControlName="status"
          appendTo="body"
        />
        <label for="budget-status">
          Estado
          <b class="text-red-400">*</b>
        </label>
      </p-floatlabel>
    </form>

    <p-toast position="bottom-right" />
  `,
  styles: '',
})
export class BudgetInformationStep
  implements OnInit, DialogOptionsBase, ISteapForm<BudgetRequest>, IClearForm
{
  protected readonly budgetStatements = BudgetStatements;

  protected formGroup = new FormGroup({
    client: new FormControl<number | null>(null, [Validators.required]),
    startDate: new FormControl(new Date(), [Validators.required]),
    endDate: new FormControl(new Date(), [Validators.required]),
    description: new FormControl('', []),
    status: new FormControl<string | null>(null, [Validators.required]),
  });

  protected clientList: ISelectItem<number>[] = [];
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

      this.clientList = clients.map((client) => ({
        label: client.personId.name + ' ' + client.personId.lastName,
        value: client.clientId,
      }));
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

  private getSelectedClient() {
    const clientId = Number(this.formGroup.controls.client.value);

    return this.$clientList?.find((client) => client.clientId === clientId)!;
  }

  public clearForm(): void {
    this.loadClients();
    this.formGroup.reset();
  }

  public getData(): BudgetRequest {
    const client = this.getSelectedClient();
    const { startDate, endDate, description, status } = this.formGroup.controls;

    return {
      descriptionBudget: description.value ?? '',
      clientId: client.clientId,
      budgetStatus: status.value!,
      dateCreated: startDate.value!,
      deadLine: endDate.value!,
    };
  }

  public setData(data: BudgetRequest) {
    const { client, startDate, endDate, description, status } =
      this.formGroup.controls;

    client.setValue(data.clientId);
    startDate.setValue(moment(data.dateCreated).toDate());
    endDate.setValue(moment(data.deadLine).toDate());
    description.setValue(data.descriptionBudget);
    status.setValue(data.budgetStatus);
  }

  get dialogEnableNext() {
    return this.formGroup.valid;
  }

  get dialogTitle() {
    return 'Información';
  }

  get dialogStyle() {
    return 'h-[32rem]';
  }
}
