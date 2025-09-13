import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { FixedCostRequest } from '../interfaces/requests/FixedCostRequest';
import { FixedCostResponse } from '../interfaces/responses/FixedCostResponse';
@Injectable({
  providedIn: 'root',
})
export class FixedCost {
  constructor(private http: HttpClient) {}

  public getFixedCosts() {
    return this.http.get<FixedCostResponse[]>(Endpoints.FIXED_COST);
  }

  public getFixedCostById(id_fixed_cost: string) {
    return this.http.get<FixedCostResponse>(
      `${Endpoints.FIXED_COST}/${id_fixed_cost}`,
    );
  }

  public createFixedCost(data: FixedCostRequest) {
    return this.http.post<void>(Endpoints.FIXED_COST, data);
  }

  public updateFixedCost(data: FixedCostRequest) {
    return this.http.put<void>(Endpoints.FIXED_COST, data);
  }

  public deleteFixedCost(id_fixed_cost: number) {
    return this.http.delete<void>(`${Endpoints.FIXED_COST}/${id_fixed_cost}`);
  }
}
