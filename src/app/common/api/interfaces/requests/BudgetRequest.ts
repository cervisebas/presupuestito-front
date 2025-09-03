export interface BudgetRequest {
    budgetId?: number;
    descriptionBudget: string;
    clientId: number;
    budgetStatus: string;
    dateCreated: Date;
    deadLine: Date;
}
