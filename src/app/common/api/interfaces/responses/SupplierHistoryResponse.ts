import { SupplierResponse } from './SupplierResponse';

export interface SupplierHistoryResponse {
  supplierHistoryId: number;
  oSupplier: SupplierResponse;
  invoices: any[];
}
