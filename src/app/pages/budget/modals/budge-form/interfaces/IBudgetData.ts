import { BudgetRequest } from '@/common/api/interfaces/requests/BudgetRequest';
import { IWorkFormData } from './IWorkFormData';

export interface IBudgetData {
  info: BudgetRequest;
  works: IWorkFormData[];
}
