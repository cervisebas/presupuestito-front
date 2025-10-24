import { Injectable } from '@angular/core';
import { IBudgetInformation } from '../interfaces/IBudgetInformation';

@Injectable({
  providedIn: 'root',
})
export class BudgetStorageInfo {
  private readonly storageName = 'budget-info';

  public getBudgetInformation(): IBudgetInformation | null {
    const storage = localStorage.getItem(this.storageName);

    if (storage) {
      return JSON.parse(storage);
    }

    return null;
  }

  public setBudgetInformation(data: IBudgetInformation) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }
}
