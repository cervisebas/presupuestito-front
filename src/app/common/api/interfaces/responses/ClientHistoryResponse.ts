import { BudgetResponse } from './BudgetResponse';
import { ClientResponse } from './ClientResponse';

export interface ClientHistoryResponse {
    clientHistoryId: number;
    clientId: ClientResponse;
    budgetsId: BudgetResponse[];
}
