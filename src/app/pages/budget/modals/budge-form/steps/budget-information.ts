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

@Component({
  selector: 'app-bugde-information',
  imports: [
    Select,
    Toast,
    DatePickerModule,
    FluidModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: DialogOptionsBase,
      useExisting: BudgetInformationStep,
    },
  ],
  template: `
    <form [formGroup]="formGroup" class="flex flex-col gap-4 pt-3 h-full">
      <p-select
        [options]="clientList"
        [loading]="clientLoading"
        optionLabel="label"
        optionValue="value"
        formControlName="client"
        placeholder="Seleccióne un cliente"
        [filter]="true"
        appendTo="body"
      />

      <p-datepicker
        placeholder="Fecha inicio"
        formControlName="startDate"
        iconDisplay="input"
        [showIcon]="true"
        dateFormat="dd/mm/yy"
        appendTo="body"
      />

      <p-datepicker
        placeholder="Fecha limite"
        formControlName="endDate"
        iconDisplay="input"
        [showIcon]="true"
        dateFormat="dd/mm/yy"
        appendTo="body"
      />

      <textarea
        rows="5"
        cols="30"
        pTextarea
        placeholder="Descripción"
        autoResize="false"
        class="resize-none"
        formControlName="description"
      ></textarea>

      <p-select
        [options]="budgetStatements"
        optionLabel="label"
        optionValue="value"
        formControlName="status"
        placeholder="Estado"
        appendTo="body"
      />
    </form>

    <p-toast />
  `,
  styles: '',
})
export class BudgetInformationStep
  implements OnInit, DialogOptionsBase, ISteapForm<BudgetRequest>
{
  protected readonly budgetStatements = BudgetStatements;

  protected formGroup = new FormGroup({
    client: new FormControl<string | null>(null, [Validators.required]),
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

  public getData(): BudgetRequest {
    const client = this.getSelectedClient();
    const { startDate, endDate, description, status } = this.formGroup.controls;

    return {
      descriptionBudget: description.value!,
      clientId: client.clientId,
      budgetStatus: status.value!,
      dateCreated: startDate.value!,
      deadLine: endDate.value!,
    };
  }

  get dialogEnableNext() {
    return this.formGroup.valid;
  }

  get dialogTitle() {
    return 'Información';
  }

  get dialogStyle() {
    return 'h-[30rem]';
  }
}
