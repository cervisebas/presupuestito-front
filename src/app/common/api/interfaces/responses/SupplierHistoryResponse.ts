import { InvoiceResponse } from './InvoiceResponse';
import { SupplierResponse } from './SupplierResponse';

export interface SupplierHistoryResponse {
    supplierHistoryId: number;
    oSupplier: SupplierResponse;
    invoices: InvoiceResponse[];
}
