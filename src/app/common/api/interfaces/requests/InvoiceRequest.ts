export interface InvoiceRequest {
  date: Date;
  isPaid: boolean;
  supplierId: number;
  invoiceId?: number;
}
