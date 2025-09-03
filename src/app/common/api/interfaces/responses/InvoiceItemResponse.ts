import { MaterialResponse } from './MaterialResponse';

export interface InvoiceItemResponse {
    invoiceId?: number;
    invoiceItemId: number;
    oMaterial: MaterialResponse;
    quantity: number;
    price: number;
}
