import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../constants/Endpoints';
import { BudgetResponse } from '../interfaces/responses/BudgetResponse';
import { BudgetRequest } from '../interfaces/requests/BudgetRequest';

@Injectable({
  providedIn: 'root',
})
export class Budget {
  constructor(private http: HttpClient) {}

  public getBudgets() {
    return this.http.get<BudgetResponse[]>(Endpoints.BUDGET);
  }

  public getBudgetById(id_budget: string) {
    return this.http.get<BudgetResponse>(`${Endpoints.BUDGET}/${id_budget}`);
  }

  public getBudgetByClientId(id_client: string) {
    return this.http.get<BudgetResponse[]>(`${Endpoints.BUDGETS_BY_CLIENT}/${id_client}`);
  }

  public getBudgetCost(id_budget: string) {
    return this.http.get<number>(`${Endpoints.BUDGET_PRICE}/${id_budget}`);
  }

  public createBudget(data: BudgetRequest) {
    return this.http.post<void>(Endpoints.BUDGET, data);
  }

  public updateBudget(data: BudgetRequest) {
    return this.http.put<void>(Endpoints.BUDGET, data);
  }

  public deleteBudget(id_budget: number) {
    return this.http.delete<void>(`${Endpoints.BUDGET}/${id_budget}`);
  }
}
