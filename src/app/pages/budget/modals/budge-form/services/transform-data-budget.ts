import { BudgetResponse } from '@/common/api/interfaces/responses/BudgetResponse';
import { Injectable } from '@angular/core';
import { IBudgetData } from '../interfaces/IBudgetData';
import moment from 'moment';

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
        dateCreated: moment(data.dateCreated).toDate(),
        deadLine: data.deadLine ? moment(data.deadLine).toDate() : null,
      },
      works: data.works.map<IBudgetData['works'][0]>((work) => {
        const materials: IBudgetData['works'][0]['materials'] =
          work.itemsId.map((item) => ({
            itemId: item.itemId,
            alreadyExist: true,
            materialName: item.oMaterial.materialName,
            materialId: item.oMaterial.materialId,
            quantity: item.quantity,
            pricePeerUnit: item.price,
            priceTotal: item.price * item.quantity,
            quantityUnit: item.oMaterial.materialUnitMeasure,
            quantityTotal:
              Number(item.oMaterial.materialMeasure) * item.quantity,
          }));

        return {
          id: work.workId,
          alreadyExist: true,

          name: work.workName,
          estimatedHours: work.estimatedHoursWorked,
          cost: work.costPrice,
          limitDate: moment(work.deadLine).toDate(),
          notes: work.notes,
          status: work.workStatus,

          materials: materials,
        };
      }),
    };
  }

  public editMergeData(editData: IBudgetData, newData: IBudgetData) {
    const data = {
      info: {
        ...newData.info,
        budgetId: editData.info.budgetId,
      },
      works: newData.works,
    };

    for (const _data of editData.works) {
      const findWork = data.works.find((val) => val.id === _data.id);

      if (!findWork) {
        data.works.push({
          ..._data,
          remove: true,
        });
        continue;
      }

      for (const item of _data.materials) {
        const findItem = findWork.materials.find(
          (val) => val.itemId === item.itemId,
        );

        if (!findItem) {
          findWork.materials.push({
            ...item,
            remove: true,
          });
        }
      }
    }

    return data;
  }
}
