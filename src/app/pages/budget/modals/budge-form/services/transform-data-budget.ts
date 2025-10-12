import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { Injectable } from '@angular/core';
import { IBudgetData } from '../interfaces/IBudgetData';

@Injectable({
  providedIn: 'root',
})
export class TransformDataBudget {
  public transform(data: BudgetResponse): IBudgetData {
    return {
      info: {
        budgetId: data.budgetId,
        descriptionBudget: data.descriptionBudget,
        clientId: data.clientId.clientId,
        budgetStatus: data.budgetStatus,
        dateCreated: data.dateCreated,
        deadLine: data.deadLine,
      },
      works: data.works.map<IBudgetData['works'][0]>((work) => {
        const materials: IBudgetData['works'][0]['materials'] =
          work.itemsId.map((item) => ({
            itemId: item.itemId,
            materialName: item.oMaterial.materialName,
            materialId: item.oMaterial.materialId,
            quantity: item.quantity,
            pricePeerUnit: item.price / item.quantity,
            priceTotal: item.price,
            quantityUnit: item.oMaterial.materialUnitMeasure,
            quantityTotal:
              Number(item.oMaterial.materialMeasure) * item.quantity,
          }));

        return {
          id: work.workId,

          name: work.workName,
          estimatedHours: work.estimatedHoursWorked,
          cost: work.costPrice,
          limitDate: work.deadLine,
          notes: work.notes,
          status: work.status,

          materials: materials,
        };
      }),
    };
  }
}
