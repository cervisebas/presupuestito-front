import { Injectable } from '@angular/core';
import { IBudgetData } from '../modals/budge-form/interfaces/IBudgetData';

@Injectable({
  providedIn: 'root',
})
export class CalculateBudget {
  public getTotalPriceMaterial(data: IBudgetData) {
    let price = 0;

    for (const { materials } of data.works) {
      for (const { priceTotal } of materials) {
        price += priceTotal ?? 0;
      }
    }

    return price;
  }

  public getTotalPriceEarnings(data: IBudgetData) {
    let price = 0;

    for (const { cost } of data.works) {
      price += cost;
    }

    return price;
  }

  public getTotalPrice(data: IBudgetData) {
    return this.getTotalPriceEarnings(data) + this.getTotalPriceMaterial(data);
  }
}
