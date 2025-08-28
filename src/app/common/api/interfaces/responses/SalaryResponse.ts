import { PaymentResponse } from './PaymentResponse';

export interface SalaryResponse {
    idSalary: number;
    amount: number;
    billDate: number;
    payments: PaymentResponse[];
}
