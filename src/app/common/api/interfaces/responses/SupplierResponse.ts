import { PersonResponse } from './PersonResponse';

export interface SupplierResponse {
  supplierId: number;
  note?: string;
  personId: PersonResponse;
}
