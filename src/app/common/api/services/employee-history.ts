import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { EmployeeHistoryRequest } from '../interfaces/requests/EmployeeHistoryRequest';
import { EmployeeHistoryResponse } from '../interfaces/responses/EmployeeHistoryResponse';

@Injectable({
  providedIn: 'root',
})
export class EmployeeHistory {
  constructor(private http: HttpClient) {}

  public getEmployeeHistories() {
    return this.http.get<EmployeeHistoryResponse[]>(
      Endpoints.EMPLOYEE_HISTORIES,
    );
  }

  public getEmployeeHistoryById(id_employee_history: string) {
    return this.http.get<EmployeeHistoryResponse>(
      `${Endpoints.EMPLOYEE_HISTORIES}/${id_employee_history}`,
    );
  }

  public createEmployeeHistory(data: EmployeeHistoryRequest) {
    return this.http.post<void>(Endpoints.EMPLOYEE_HISTORIES, data);
  }

  public updateEmployeeHistory(data: EmployeeHistoryRequest) {
    return this.http.put<void>(Endpoints.EMPLOYEE_HISTORIES, data);
  }

  public deleteEmployeeHistory(id_employee_history: number) {
    return this.http.delete<void>(
      `${Endpoints.EMPLOYEE_HISTORIES}/${id_employee_history}`,
    );
  }
}
