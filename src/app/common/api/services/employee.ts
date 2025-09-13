import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { EmployeeRequest } from '../interfaces/requests/EmployeeRequest';
import { EmployeeResponse } from '../interfaces/responses/EmployeeResponse';
@Injectable({
  providedIn: 'root',
})
export class Employee {
  constructor(private http: HttpClient) {}

  public getEmployees() {
    return this.http.get<EmployeeResponse[]>(Endpoints.EMPLOYEES);
  }

  public getEmployeeById(id_employee: string) {
    return this.http.get<EmployeeResponse>(`${Endpoints.EMPLOYEES}/${id_employee}`);
  }

  public createEmployee(data: EmployeeRequest) {
    return this.http.post<void>(Endpoints.EMPLOYEES, data);
  }

  public updateEmployee(data: EmployeeRequest) {
    return this.http.put<void>(Endpoints.EMPLOYEES, data);
  }

  public deleteEmployee(id_employee: number) {
    return this.http.delete<void>(`${Endpoints.EMPLOYEES}/${id_employee}`);
  }
}
