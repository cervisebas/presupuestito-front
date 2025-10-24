import { ItemResponse } from './ItemResponse';

export interface WorkResponse {
  workId: number;
  budgetId: number;
  itemsId: ItemResponse[];
  workStatus: string;
  workName: string;
  estimatedHoursWorked: number;
  deadLine: Date;
  costPrice: number;
  status: string;
  notes: string;
}
