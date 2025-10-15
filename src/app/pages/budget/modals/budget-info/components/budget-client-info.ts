import {
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

@Component({
  selector: 'app-budget-client-info',
  imports: [DatePipe, CurrencyPipe, Divider],
  template: `
    <div #element class="w-full flex flex-col gap-4">
      @for (section of sections; track $index) {

        @if ($index !== 0) {
          <p-divider class="break-after-all print:hidden" />
        }

        <table class="border-collapse w-full">
          <thead>
            <tr>
              <th colspan="100%">
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
                      <b>Empresa:</b> 
                      <b>Teléfono:</b>
                      <b>E-Mail:</b>
                      <b>Dirección:</b>
                    </div>
    
                    <div class="flex flex-col gap-2 items-start ps-4">
                      <span>Nombre extendido de la empresa</span>
                      <span>2291-450000</span>
                      <span>test@correo.com</span>
                      <span>Avenida 9 95000</span>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
    
            <tr>
              <th colspan="100%">
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
                  <span class="font-normal">{{ item.materialName }} <b>x {{ (item.priceTotal ?? 0) / (item.pricePeerUnit ?? 0) }} {{ item.quantityUnit }}</b></span>  
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
              <td class="text-left ps-6 py-3">
                <span class="font-normal">Ganancias</span>  
              </td>
              <td class="text-center py-3">
                <span class="font-normal">-</span>  
              </td>
              <td class="text-center py-3">
                <span class="font-normal">-</span>  
              </td>
              <td class="text-center py-3">
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
    th:not(tfoot th),
    td {
      @apply border-2;
    }
  `,
})
export class BudgetClientInfo implements OnChanges {
  @ViewChild('element')
  private element?: ElementRef<HTMLDivElement>;

  @Input()
  public data!: IBudgetData;

  @Input()
  public separateByWork = false;

  protected sections: ISectionBudgetItem[] = [];

  protected clientLoading = true;

  constructor(private generateBudgetSections: GenerateBudgetSections) {}

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

  private generateSections() {
    if (this.separateByWork) {
      this.sections = this.generateBudgetSections.getByWork(this.data);
    } else {
      this.sections = this.generateBudgetSections.getUnificated(this.data);
    }
  }

  public getElement() {
    return this.element?.nativeElement;
  }
}
