import { Injectable } from '@angular/core';
import { IBudgetData } from '../interfaces/IBudgetData';
import { lastValueFrom } from 'rxjs';
import { Budget } from '@/common/api/services/budget';
import { Work } from '@/common/api/services/work';
import { Item } from '@/common/api/services/item';

@Injectable({
  providedIn: 'root',
})
export class SendBudgetService {
  constructor(
    private budgetService: Budget,
    private workService: Work,
    private itemService: Item,
  ) {}

  public async create(data: IBudgetData) {
    try {
      const newBudget = await lastValueFrom(
        this.budgetService.createBudget({
          ...data.info,
          descriptionBudget: data.info.descriptionBudget || '',
        }),
      );

      for (const work of data.works) {
        const newWork = await lastValueFrom(
          this.workService.createWork({
            workName: work.name,
            estimatedHoursWorked: work.estimatedHours,
            deadLine: work.limitDate,
            costPrice: work.cost,
            budgetId: newBudget.budgetId,
            workStatus: work.status,
            notes: work.notes,
          }),
        );

        for (const item of work.materials) {
          await lastValueFrom(
            this.itemService.createItem({
              MaterialId: item.materialId!,
              WorkId: newWork.workId,
              Quantity: item.quantity,
              Price: item.pricePeerUnit ?? 0,
            }),
          );
        }
      }
    } catch (error) {
      console.error(error);
      throw 'Ocurrio un error inesperado al crear el presupuesto, por favor pruebe de nuevo más tarde.';
    }
  }

  public async edit(data: IBudgetData) {
    try {
      const budgetId = data.info.budgetId!;

      await lastValueFrom(
        this.budgetService.updateBudget(budgetId, {
          ...data.info,
          descriptionBudget: data.info.descriptionBudget || '',
        }),
      );

      for (const work of data.works) {
        let workId = work.id ?? -1;

        if (work.remove) {
          await lastValueFrom(this.workService.deleteWork(workId));

          continue;
        }

        if (!work.alreadyExist) {
          const newWork = await lastValueFrom(
            this.workService.createWork({
              workName: work.name,
              estimatedHoursWorked: work.estimatedHours,
              deadLine: work.limitDate,
              costPrice: work.cost,
              budgetId: budgetId,
              workStatus: work.status,
              notes: work.notes,
            }),
          );

          workId = newWork.workId!;
        } else {
          workId = work.id!;
          await lastValueFrom(
            this.workService.updateWork(workId, {
              workName: work.name,
              estimatedHoursWorked: work.estimatedHours,
              deadLine: work.limitDate,
              costPrice: work.cost,
              budgetId: budgetId,
              workStatus: work.status,
              notes: work.notes,
            }),
          );
        }

        for (const item of work.materials) {
          if (item.remove) {
            await lastValueFrom(this.itemService.deleteItem(item.itemId!));
            continue;
          }

          if (item.alreadyExist) {
            await lastValueFrom(
              this.itemService.updateItem(item.itemId!, {
                MaterialId: item.materialId!,
                WorkId: workId,
                Quantity: item.quantity,
                Price: item.pricePeerUnit ?? 0,
              }),
            );
          } else {
            await lastValueFrom(
              this.itemService.createItem({
                MaterialId: item.materialId!,
                WorkId: workId,
                Quantity: item.quantity,
                Price: item.pricePeerUnit ?? 0,
              }),
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      throw 'Ocurrio un error inesperado al crear el presupuesto, por favor pruebe de nuevo más tarde.';
    }
  }
}
