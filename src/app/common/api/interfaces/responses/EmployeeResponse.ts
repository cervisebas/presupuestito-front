import { PersonResponse } from './PersonResponse';

export interface EmployeeResponse {
    idEmployee: number;
    oPerson: PersonResponse;
    salary?: number;
}
