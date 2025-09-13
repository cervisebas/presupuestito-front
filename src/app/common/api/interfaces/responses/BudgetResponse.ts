import { PaymentResponse } from './PaymentResponse';
import { WorkResponse } from './WorkResponse';

export interface BudgetResponse {
  budgetId: number;
  works: WorkResponse[];
  dateCreated: Date;
  deadLine: Date;
  descriptionBudget: string;
  cost: number;
  budgetStatus: string;
  payments?: PaymentResponse[];
}
