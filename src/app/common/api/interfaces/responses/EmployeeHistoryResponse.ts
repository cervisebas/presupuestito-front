import { EmployeeResponse } from './EmployeeResponse';
import { SalaryResponse } from './SalaryResponse';

export interface EmployeeHistoryResponse {
  idEmployeeHistory: number;
  oEmployee: EmployeeResponse;
  salaries: SalaryResponse[];
}
