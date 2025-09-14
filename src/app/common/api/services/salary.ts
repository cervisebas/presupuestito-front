import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { SalaryRequest } from '../interfaces/requests/SalaryRequest';
import { SalaryResponse } from '../interfaces/responses/SalaryResponse';
@Injectable({
  providedIn: 'root',
})
export class Salary {
  constructor(private http: HttpClient) {}

  public getSalaries() {
    return this.http.get<SalaryResponse[]>(Endpoints.SALARIES);
  }

  public getSalaryById(id_salary: string) {
    return this.http.get<SalaryResponse>(`${Endpoints.SALARIES}/${id_salary}`);
  }

  public createSalary(data: SalaryRequest) {
    return this.http.post<void>(Endpoints.SALARIES, data);
  }

  public updateSalary(data: SalaryRequest) {
    return this.http.put<void>(Endpoints.SALARIES, data);
  }

  public deleteSalary(id_salary: number) {
    return this.http.delete<void>(`${Endpoints.SALARIES}/${id_salary}`);
  }
}
