import { PaymentResponse } from './PaymentResponse';
import { InvoiceItemResponse } from './InvoiceItemResponse';
import { SupplierResponse } from './SupplierResponse';

export interface InvoiceResponse {
    date: Date;
    invoiceId: number;
    isPaid: boolean;
    oInvoiceItems: InvoiceItemResponse[];
    oSupplier?: SupplierResponse;
    payments: PaymentResponse[];
    supplierId?: 0;
}
