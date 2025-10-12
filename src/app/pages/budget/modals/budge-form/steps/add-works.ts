import { DialogOptionsBase } from '@/common/classes/DialogOptions';
import { Component, OnInit } from '@angular/core';
import { WorkRequest } from '@/common/api/interfaces/requests/WorkRequest';
import { ISteapForm } from '../interfaces/ISteapForm';
import { WorkItem } from '../components/work-item';
import { Material } from '@/common/api/services/material';
import { ISelectItem } from '@/common/interfaces/ISelectItem';
import { LoadingContainer } from '@/common/components/loading-container';
import { IWorkFormData } from '../interfaces/IWorkFormData';
import { BudgetStatements } from '@/pages/budget/constants/BudgetStatements';
import { Button } from 'primeng/button';

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
        class="flex w-full flex-col gap-4 h-full overflow-x-hidden overflow-y-scroll pb-6"
      >
        @for (work of works; track work?.id) {
          <app-work-item
            [materials]="materialList"
            [(data)]="works[$index]"
            [disableRemove]="works.length === 1"
            (onRemove)="removeWork($index)"
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
  implements OnInit, DialogOptionsBase, ISteapForm<WorkRequest[]>
{
  protected readonly budgetStatements = BudgetStatements;

  protected materialLoading = true;
  protected materialError = null;

  protected works: IWorkFormData[] = [];

  protected materialList: ISelectItem<number>[] = [];

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
      name: 'Nuevo trabajo',
      estimatedHours: 0,
      limitDate: new Date(),
      notes: '',
      status: this.budgetStatements.at(0)!.value,
      materials: [
        {
          materialId: null,
          quantity: 1,
        },
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

  public getData(): WorkRequest[] {
    throw new Error('Method not implemented.');
  }

  public get dialogEnableNext() {
    return false;
  }

  public get dialogTitle(): string {
    return 'Trabajos';
  }

  public get dialogStyle(): string | undefined {
    return 'w-[50rem] h-[95dvh]';
  }
}
