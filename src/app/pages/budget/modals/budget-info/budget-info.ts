import { Component, ViewChild } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BudgetSummaryStep } from '../budge-form/steps/budget-summary';
import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { IBudgetData } from '../budge-form/interfaces/IBudgetData';
import { TransformDataBudget } from '../budge-form/services/transform-data-budget';
import { BudgetClientInfo } from './components/budget-client-info';
import { TabsModule } from 'primeng/tabs';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GeneratePdfService } from '@/common/services/generate-pdf';
import { PrintDocumentService } from '@/common/services/print-document';
import { LoadingService } from '@/common/services/loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-info',
  imports: [
    Dialog,
    TableModule,
    BudgetSummaryStep,
    BudgetClientInfo,
    TabsModule,
    Button,
    Checkbox,
    FormsModule,
  ],
  providers: [BudgetSummaryStep],
  template: `
    <p-dialog
      header="Información del presupuesto"
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      styleClass="max-w-[95dvw] max-h-[95dvh] w-[60rem] h-[98dvh] overflow-hidden"
      contentStyleClass="size-full !p-0"
    >
      @if (data) {
        <p-tabs [(value)]="tabValue" class="size-full overflow-auto">
          <div class="sticky top-0 z-10">
            <p-tablist class="min-h-[48px]">
              <p-tab [value]="SummaryTabName">Vista resumida</p-tab>
              <p-tab [value]="BudgetTabName">Vista presupuesto</p-tab>
            </p-tablist>
          </div>
          <p-tabpanels>
            <p-tabpanel [value]="SummaryTabName">
              <app-budget-summary [data]="data" [enableScroll]="false" />
            </p-tabpanel>
            <p-tabpanel [value]="BudgetTabName">
              <app-budget-client-info
                [data]="data"
                [separateByWork]="separateByWork"
              />
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      }

      <ng-template #footer>
        <div class="w-full flex flex-row pt-3">
          <!-- @if (tabValue === BudgetTabName) {
            <div class="px-4 flex flex-row items-center gap-3">
              <p-checkbox
                inputId="budget-separate-by-work"
                [(ngModel)]="separateByWork"
                [binary]="true"
              />
              <label for="budget-separate-by-work" class="select-none">
                Separar por trabajo
              </label>
            </div>
          } -->
          <div class="flex flex-1 justify-end gap-2">
            @if (tabValue !== BudgetTabName) {
              <p-button
                label="Ver perfil de cliente"
                (onClick)="showClient()"
              />
            } @else {
              <p-button
                label="Imprimir"
                severity="secondary"
                (onClick)="printDocument()"
              />

              <p-button label="Descargar" (onClick)="saveDocument()" />
            }
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: '',
})
export class BudgetInfo {
  @ViewChild(BudgetClientInfo)
  private budgetClientInfo?: BudgetClientInfo;

  @ViewChild(BudgetSummaryStep)
  private budgetSummaryStep?: BudgetSummaryStep;

  protected visible = false;
  protected data?: IBudgetData;

  protected readonly SummaryTabName = 'summary';
  protected readonly BudgetTabName = 'budget';

  protected tabValue = this.SummaryTabName;
  protected separateByWork = false;

  constructor(
    private transformDataBudget: TransformDataBudget,
    private generatePdfService: GeneratePdfService,
    private printDocumentService: PrintDocumentService,
    private loadingService: LoadingService,
    private router: Router,
  ) {}

  public open(budget: BudgetResponse) {
    this.tabValue = this.SummaryTabName;
    this.data = this.transformDataBudget.transform(budget);
    this.visible = true;
  }

  protected showClient() {
    this.router.navigate(['/clients'], {
      state: {
        clientId: this.data?.info.clientId,
      },
    });
  }

  private getPdfCurrentTab() {
    switch (this.tabValue) {
      case this.SummaryTabName:
        const summaryElement = this.budgetSummaryStep?.getElement();

        if (!summaryElement) {
          return;
        }

        return this.generatePdfService.fromHTMLElement(
          summaryElement,
          this.budgetFileName,
        );

      case this.BudgetTabName:
        const budgetElement = this.budgetClientInfo?.getElement();

        if (!budgetElement) {
          return;
        }

        return this.generatePdfService.fromHTMLElement(
          budgetElement,
          this.budgetFileName,
        );
    }

    return null;
  }

  protected printDocument() {
    this.loadingService.setLoading(true);
    const pdf = this.getPdfCurrentTab();

    if (pdf) {
      this.printDocumentService.fromPDFObject(pdf);
    }

    setTimeout(() => {
      this.loadingService.setLoading(false);
    }, 1000);
  }

  protected saveDocument() {
    this.loadingService.setLoading(true);
    const pdf = this.getPdfCurrentTab();

    if (pdf) {
      pdf.save();
    }

    setTimeout(() => {
      this.loadingService.setLoading(false);
    }, 1000);
  }

  private get budgetFileName(): `${string}.pdf` {
    return `${this.data?.info.budgetId}-budget.pdf`;
  }
}
