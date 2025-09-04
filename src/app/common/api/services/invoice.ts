import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import  {InvoiceRequest} from '../interfaces/requests/InvoiceRequest';
import { InvoiceResponse } from '../interfaces/responses/InvoiceResponse';

@Injectable({
  providedIn: 'root'
})
export class Invoice {
  
  constructor(
    private http: HttpClient,
  ) {}

  public getInvoices() {
    return this.http.get<InvoiceResponse[]>(
      Endpoints.INVOICES,
    );
  }

  public getInvoiceById(id_invoice: string) {
    return this.http.get<InvoiceResponse>(
      `${Endpoints.INVOICES}/${id_invoice}`,
    );
  }

  public createInvoice(data: InvoiceRequest) {
    return this.http.post<void>(
      Endpoints.INVOICES,
      data,
    );
  }
  
  public updateInvoice(data: InvoiceRequest) {
    return this.http.put<void>(
      Endpoints.INVOICES,
      data,
    );
  }
  
  public deleteInvoice(id_invoice: number) {
    return this.http.delete<void>(
      `${Endpoints.INVOICES}/${id_invoice}`,
    );
  }

  public getInvoiceBySupplierId(id_supplier: string) {
    return this.http.get<InvoiceResponse[]>(
      `${Endpoints.INVOICES_BY_SUPPLIER}${id_supplier}`,
    );
  }
}
