export interface WorkRequest {
  workId?: number;
  workName: string;
  estimatedHoursWorked: number;
  deadLine: Date;
  costPrice: number;
  budgetId: number;
  workStatus: string;
  notes: string;
}
