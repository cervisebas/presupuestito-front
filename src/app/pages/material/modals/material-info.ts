import { MaterialResponse } from '@/common/api/interfaces/responses/MaterialResponse';
import { CurrencyPipe } from '@/common/pipes/currency-pipe';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-material-info',
  imports: [Dialog, TableModule],
  providers: [CurrencyPipe],
  template: `
    <p-dialog
      header="Información del material"
      [modal]="true"
      [draggable]="false"
      [closable]="true"
      [closeOnEscape]="false"
      [(visible)]="visible"
      styleClass="max-w-9/10 w-[30rem]"
    >
      <p-table [value]="data" class="w-full">
        <ng-template #body let-product>
          <tr>
            <td class="font-semibold underline">{{ product.label }}</td>
            <td>{{ product.value }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-dialog>
  `,
  styles: '',
})
export class MaterialInfo {
  protected visible = false;
  protected data: {
    label: string;
    value: string;
  }[] = [];

  constructor(private currencyPipe: CurrencyPipe) {}

  public open(material: MaterialResponse) {
    this.data = [];

    this.addValue('Nombre', material.materialName);
    this.addValue('Precio', this.currencyPipe.transform(material.price));
    this.addValue('Descripción', material.materialDescription);
    this.addValue('Marca', material.materialBrand);
    this.addValue('Color', material.materialColor);
    this.addValue(
      'Medida',
      `${material.materialMeasure} ${material.materialUnitMeasure}`,
    );
    this.addValue(
      'Rubro',
      material.subCategoryMaterialId.categoryId.categoryName,
    );
    this.addValue('Sub-Rubro', material.subCategoryMaterialId.subCategoryName);

    this.visible = true;
  }

  private addValue(label: string, value: string) {
    this.data.push({
      label,
      value,
    });
  }
}
