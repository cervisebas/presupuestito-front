import { Injectable } from '@angular/core';
import { ISectionBudgetItem } from '../interfaces/ISectionBudgetItem';
import { IBudgetData } from '../../budge-form/interfaces/IBudgetData';
import { CalculateBudget } from '@/pages/budget/services/calculate-budget';

@Injectable({
  providedIn: 'root',
})
export class GenerateBudgetSections {
  constructor(private calculateBudget: CalculateBudget) {}

  public getUnificated(data: IBudgetData): ISectionBudgetItem[] {
    const items: ISectionBudgetItem['items'] = [];

    for (const work of data.works) {
      items.push(...work.materials);
    }

    const result: ISectionBudgetItem = {
      title: `Presupuesto Nº${data.info.budgetId}`,
      items: items,
      total: this.calculateBudget.getTotalPrice(data),
      startDate: data.info.dateCreated,
      endDate: data.info.deadLine,
      subtotal: this.calculateBudget.getTotalPriceMaterial(data),
    };

    return [result];
  }

  public getByWork(data: IBudgetData): ISectionBudgetItem[] {
    const sections: ISectionBudgetItem[] = [];

    for (const work of data.works) {
      const totalMaterials = work.materials.reduce(
        (prev, material) => prev + (material.priceTotal ?? 0),
        0,
      );

      sections.push({
        title: work.name,
        items: work.materials,
        total: totalMaterials + work.cost,
        startDate: data.info.dateCreated,
        endDate: data.info.deadLine,
        subtotal: totalMaterials,
      });
    }

    return sections;
  }
}
