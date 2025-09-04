import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { CostRequest } from '../interfaces/requests/CostRequest';
import { CostResponse } from '../interfaces/responses/CostResponse';
@Injectable({
  providedIn: 'root'
})
export class Cost {

  constructor(
    private http: HttpClient,
  ) {}

  public getCosts() {
    return this.http.get<CostResponse[]>(
      Endpoints.COSTS,
    );
  }

  public getCostById(id_cost: string) {
    return this.http.get<CostResponse>(
      `${Endpoints.COSTS}/${id_cost}`,
    );
  }

  public createCost(data: CostRequest) {
    return this.http.post<void>(
      Endpoints.COSTS,
      data,
    );
  }
  
  public updateCost(data: CostRequest) {
    return this.http.put<void>(
      Endpoints.COSTS,
      data,
    );
  }
  
  public deleteCost(id_cost: number) {
    return this.http.delete<void>(
      `${Endpoints.COSTS}/${id_cost}`,
    );
  }
  
}
