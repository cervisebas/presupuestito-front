import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IBudgetData } from '../../budge-form/interfaces/IBudgetData';
import { Divider } from 'primeng/divider';
import { GenerateBudgetSections } from '../services/generate-budget-sections';
import { ISectionBudgetItem } from '../interfaces/ISectionBudgetItem';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';

import { BudgetStorageInfo } from '@/pages/budget/services/budget-storage-info';
import { ContenteditableValueAccessorDirective } from '@/common/directives/contenteditable-value-accessor';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IBudgetInformation } from '@/pages/budget/interfaces/IBudgetInformation';

@Component({
  selector: 'app-budget-client-info',
  imports: [
    DatePipe,
    CurrencyPipe,
    Divider,
    ContenteditableValueAccessorDirective,
    ReactiveFormsModule,
  ],
  template: `
    <div #element class="w-full flex flex-col gap-4">
      @for (section of sections; track $index) {

        @if ($index !== 0) {
          <p-divider class="break-after-all html2pdf__page-break" />
        }

        <table class="!border-collapse !border-spacing-0 w-full" [cellSpacing]="0" [cellPadding]="0">
          <thead>
            <tr>
              <th colspan="100%" class="!border-b-2">
                <div class="flex w-full py-8 justify-center">
                  <h1 class="!text-2xl !text-black !m-0">{{ section.title }}</h1>
                </div>
              </th>
            </tr>

            <tr>
              <th colspan="100%" class="!border-0 py-2"></th>
            </tr>
    
            <tr>
              <th colspan="100%">
                <div class="w-full py-4 px-6">
                  <div class="flex flex-row">
                    <div class="flex flex-col gap-2 items-start">
                      <b (click)="enterpriceName.focus()">Empresa:</b> 
                      <b (click)="enterpricePhone.focus()">Teléfono:</b>
                      <b (click)="enterpriceEmail.focus()">E-Mail:</b>
                      <b (click)="enterpriceAddress.focus()">Dirección:</b>
                    </div>
    
                    <form [formGroup]="formGroup" class="flex flex-col gap-2 items-start ps-4">
                      <span
                        #enterpriceName
                        formControlName="enterpriceName"
                        contenteditable
                        (blur)="saveEnterpriceData()"
                      >
                        Nombre extendido de la empresa
                      </span>
                      <span
                        #enterpricePhone
                        formControlName="enterpricePhone"
                        contenteditable
                        (blur)="saveEnterpriceData()"
                      >
                        2291-450000
                      </span>
                      <span
                        #enterpriceEmail
                        formControlName="enterpriceEmail"
                        contenteditable
                        (blur)="saveEnterpriceData()"
                      >
                        test@correo.com
                      </span>
                      <span
                        #enterpriceAddress
                        formControlName="enterpriceAddress"
                        contenteditable
                        (blur)="saveEnterpriceData()"
                      >
                        Avenida 9 95000
                      </span>
                    </form>
                  </div>
                </div>
              </th>
            </tr>
    
            <tr>
              <th colspan="100%" class="!border-b-2">
                <div class="grid grid-cols-2 w-full py-4 px-6">
                  <div class="flex flex-row gap-2">
                    <b>Fecha del presupuesto:</b> 
                    <span>{{ section.startDate | date: 'dd/MM/yyyy' }}</span>
                  </div>
    
                  <div class="flex flex-row gap-2">
                    <b>Validez:</b> 
                    <span>{{ section.endDate | date: 'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </th>
            </tr>

            <tr>
              <th colspan="100%" class="!border-0 py-2"></th>
            </tr>

            <tr>
              <th class="text-left ps-6 py-2 w-4/10"><b>Descripción</b></th>
              <th class="text-center py-2 w-2/10"><b>Cantidad</b></th>
              <th class="text-center py-2 w-2/10"><b>Precio</b></th>
              <th class="text-center py-2 w-2/10"><b>Importe</b></th>
            </tr>
          </thead>

          <tbody>
            @for (item of section.items; track $index) {
              <tr>
                <td class="text-left ps-6 py-3">
                  <span class="font-normal">{{ item.materialName }} <b>x  {{ getMaterialQuantity(item.priceTotal, item.pricePeerUnit) }} {{ item.quantityUnit }}</b></span>  
                </td>
                <td class="text-center py-3">
                  <span class="font-normal">{{ item.quantityTotal }} {{ item.quantityUnit }}</span>  
                </td>
                <td class="text-center py-3">
                  <span class="font-normal">{{ item.pricePeerUnit ?? 0 | currency }}</span>  
                </td>
                <td class="text-center py-3">
                  <span class="font-normal">{{ item.priceTotal ?? 0 | currency }}</span>  
                </td>
              </tr>
            }

            <tr>
              <td class="text-left ps-6 py-3 !border-b-2">
                <span class="font-normal">Ganancias</span>  
              </td>
              <td class="text-center py-3 !border-b-2">
                <span class="font-normal">-</span>  
              </td>
              <td class="text-center py-3 !border-b-2">
                <span class="font-normal">-</span>  
              </td>
              <td class="text-center py-3 !border-b-2">
                <span class="font-normal">{{ section.total - section.subtotal | currency }}</span>  
              </td>
            </tr>

            <tr>
              <th colspan="100%" class="!border-0 py-2"></th>
            </tr>
          </tbody>

          <tfoot class="border-2">
            <tr>
              <th></th>
              <th></th>
              <th class="pt-3 pb-1 pe-2 text-lg text-right"><b>SUBTOTAL:</b> </th>
              <th class="pt-3 pb-1 ps-2 text-lg text-left"><span>{{ section.subtotal | currency }}</span></th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th class="pt-1 pb-3 pe-2 text-lg text-right"><b>TOTAL:</b> </th>
              <th class="pt-1 pb-3 ps-2 text-lg text-left"><span>{{ section.total | currency }}</span></th>
            </tr>
          </tfoot>
        </table>
      }
    </div>
  `,
  styles: `
    table {
      @apply border-collapse;
    }

    th:not(tfoot th),
    td {
      @apply border-2;
    }

    tr {
      td:not(tr > td:nth-child(0)):not(tr > td:last-child),
      th:not(tr > th:nth-child(0)):not(tr > th:last-child) {
        border-right: 0 !important;
      }
    }

    table {
      thead,
      tbody,
      tfoot {
        tr:not(thead > tr:last-child),
        tr:not(tbody > tr:last-child),
        tr:not(tfoot > tr:last-child) {
          td,
          th {
            border-bottom: 0;
          }
        }
      }
    }
  `,
})
export class BudgetClientInfo implements AfterViewInit, OnChanges {
  protected formGroup = new FormGroup({
    enterpriceName: new FormControl('', { updateOn: 'change' }),
    enterpricePhone: new FormControl('', { updateOn: 'change' }),
    enterpriceEmail: new FormControl('', { updateOn: 'change' }),
    enterpriceAddress: new FormControl('', { updateOn: 'change' }),
  });

  @ViewChild('element')
  private element?: ElementRef<HTMLDivElement>;

  @Input()
  public data!: IBudgetData;

  @Input()
  public separateByWork = false;

  protected sections: ISectionBudgetItem[] = [];

  protected clientLoading = true;

  constructor(
    private generateBudgetSections: GenerateBudgetSections,
    private budgetStorageInfo: BudgetStorageInfo,
  ) {}

  ngAfterViewInit(): void {
    this.loadEnterpriceData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      ('data' in changes &&
        changes['data'].currentValue !== changes['data'].previousValue) ||
      ('separateByWork' in changes &&
        changes['separateByWork'].currentValue !==
          changes['separateByWork'].previousValue)
    ) {
      this.generateSections();
    }
  }

  protected getMaterialQuantity(
    priceTotal: number | undefined,
    pricePeerUnit: number | undefined,
  ) {
    return Math.fround((priceTotal ?? 0) / (pricePeerUnit ?? 0));
  }

  private generateSections() {
    if (this.separateByWork) {
      this.sections = this.generateBudgetSections.getByWork(this.data);
    } else {
      this.sections = this.generateBudgetSections.getUnificated(this.data);
    }
  }

  private loadEnterpriceData() {
    const storageData = this.budgetStorageInfo.getBudgetInformation();
    const {
      enterpriceName,
      enterpricePhone,
      enterpriceEmail,
      enterpriceAddress,
    } = this.formGroup.controls;

    enterpriceName.setValue(storageData?.name || 'Nombre de la empresa');
    enterpricePhone.setValue(storageData?.phone || '2291 00-0000');
    enterpriceEmail.setValue(
      storageData?.email || 'email-de-empresa@ejemplo.com',
    );
    enterpriceAddress.setValue(
      storageData?.address || 'Dirección de la empresa',
    );
  }

  protected saveEnterpriceData() {
    const {
      enterpriceName,
      enterpricePhone,
      enterpriceEmail,
      enterpriceAddress,
    } = this.formGroup.controls;

    const data: IBudgetInformation = {
      name: enterpriceName.value!,
      phone: enterpricePhone.value!,
      email: enterpriceEmail.value!,
      address: enterpriceAddress.value!,
    };

    this.budgetStorageInfo.setBudgetInformation(data);
    this.formGroup.setValue({
      enterpriceName: data.name.trim(),
      enterpricePhone: data.phone.trim(),
      enterpriceEmail: data.email.trim(),
      enterpriceAddress: data.address.trim(),
    });
  }

  public getElement() {
    return this.element?.nativeElement;
  }
}
