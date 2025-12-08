import { DialogOptionsBase } from '@/common/classes/DialogOptions';
import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ISteapForm } from '../interfaces/ISteapForm';
import { WorkItem } from '../components/work-item';
import { Material } from '@/common/api/services/material';
import { ISelectItem } from '@/common/interfaces/ISelectItem';
import { LoadingContainer } from '@/common/components/loading-container';
import { IWorkFormData } from '../interfaces/IWorkFormData';
import { BudgetStatements } from '@/pages/budget/constants/BudgetStatements';
import { Button } from 'primeng/button';
import { MaterialResponse } from '@/common/api/interfaces/responses/MaterialResponse';
import { IClearForm } from '@/common/interfaces/IClearForm';

@Component({
  selector: 'app-add-works',
  imports: [WorkItem, LoadingContainer, Button],
  providers: [
    {
      provide: DialogOptionsBase,
      useExisting: AddWorkStep,
    },
  ],
  template: `
    <app-loading-container [loading]="materialLoading" [error]="materialError">
      <div
        class="flex w-full flex-col gap-4 h-full overflow-x-auto overflow-y-scroll pb-6"
      >
        @for (work of works; track work?.id) {
          <app-work-item
            [index]="$index"
            [materials]="materialList"
            [(data)]="works[$index]"
            [disableRemove]="works.length === 1"
            (onRemove)="removeWork($index)"
            [isEditing]="isEditing"
          />
        }

        <p-button
          class="w-full"
          styleClass="w-full"
          icon="pi pi-plus"
          label="Añadir trabajo"
          severity="info"
          (onClick)="addWork()"
        />
      </div>
    </app-loading-container>
  `,
  styles: '',
})
export class AddWorkStep
  implements OnInit, DialogOptionsBase, ISteapForm<IWorkFormData[]>, IClearForm
{
  @ViewChildren(WorkItem)
  private workItems?: QueryList<WorkItem>;

  protected readonly budgetStatements = BudgetStatements;

  @Input()
  public isEditing?: boolean;

  protected materialLoading = true;
  protected materialError = null;

  protected works: IWorkFormData[] = [];

  protected materialList: ISelectItem<number>[] = [];
  protected $materialList: MaterialResponse[] = [];

  constructor(private materialService: Material) {}

  ngOnInit(): void {
    this.loadMaterials();

    if (!this.works.length) {
      this.addWork();
    }
  }

  protected addWork() {
    this.works.push({
      id: Date.now(),
      name: `Trabajo ${this.works.length + 1}`,
      estimatedHours: 0,
      cost: 0,
      limitDate: new Date(),
      notes: '',
      status: this.budgetStatements.at(0)!.value,
      materials: [
        /* {
          materialId: null,
          quantity: 1,
        }, */
      ],
    });
  }

  protected removeWork(index: number) {
    const newWorks = [...this.works];

    newWorks.splice(index, 1);
    this.works = newWorks;
  }

  private loadMaterials() {
    this.materialError = null;
    this.materialLoading = true;

    this.materialService.getMaterials().subscribe({
      next: (material) => {
        this.$materialList = material;
        this.materialList = material.map((value) => ({
          label: value.materialName,
          value: value.materialId,
        }));
      },
      error: (err) => {
        this.materialError = err;
        this.materialLoading = false;
      },
      complete: () => {
        this.materialLoading = false;
      },
    });
  }

  public clearForm() {
    this.loadMaterials();
    this.works = [];
    this.addWork();
  }

  public getData(): IWorkFormData[] {
    return this.works.map((work) => ({
      ...work,
      materials: work.materials.map<IWorkFormData['materials'][0]>(
        (material) => {
          const materialItem = this.$materialList.find(
            (item) => item.materialId === material.materialId,
          );

          return {
            ...material,
            materialName: materialItem?.materialName,
            pricePeerUnit: materialItem?.price,
            priceTotal: (materialItem?.price ?? 0) * material.quantity,
            quantityUnit: materialItem?.materialUnitMeasure,
            quantityTotal:
              Number(materialItem?.materialMeasure) * material.quantity,
          };
        },
      ),
    }));
  }

  public setData(data: IWorkFormData[]) {
    this.works = data;
  }

  public get dialogEnableNext() {
    const statusForms =
      this.workItems?.map((workItem) => workItem.invalidForm) || [];

    return statusForms.every((val) => val === false);
  }

  public get dialogTitle() {
    return 'Trabajos';
  }

  public get dialogStyle() {
    return 'w-[50rem] h-[95dvh]';
  }
}
