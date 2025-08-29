import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { InvoiceItemRequest} from '../interfaces/requests/InvoiceItemRequest';
import { InvoiceItemResponse } from '../interfaces/responses/InvoiceItemResponse';
@Injectable({
  providedIn: 'root'
})
export class InvoiceItem {

  constructor(
    private http: HttpClient,
  ) {}

  public getInvoiceItems() {
    return this.http.get<InvoiceItemResponse[]>(
      Endpoints.INVOICE_ITEM,
    );
  }

  public getInvoiceItemById(id_invoice_item: string) {
    return this.http.get<InvoiceItemResponse>(
      `${Endpoints.INVOICE_ITEM}/${id_invoice_item}`,
    );
  }

  public createInvoiceItem(data: InvoiceItemRequest) {
    return this.http.post<void>(
      Endpoints.INVOICE_ITEM,
      data,
    );
  }
  
  public updateInvoiceItem(data: InvoiceItemRequest) {
    return this.http.put<void>(
      Endpoints.INVOICE_ITEM,
      data,
    );
  }
  
  public deleteInvoiceItem(id_invoice_item: number) {
    return this.http.delete<void>(
      `${Endpoints.INVOICE_ITEM}/${id_invoice_item}`,
    );
  }
}
