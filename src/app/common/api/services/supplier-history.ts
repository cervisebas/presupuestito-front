import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { SupplierHistoryRequest } from '../interfaces/requests/SupplierHistoryRequest';
import { SupplierHistoryResponse } from '../interfaces/responses/SupplierHistoryResponse';

@Injectable({
  providedIn: 'root'
})
export class SupplierHistory {
  constructor(
    private http: HttpClient,
  ) {}

  public getSupplierHistories() {
    return this.http.get<SupplierHistoryResponse[]>(
      Endpoints.SUPPLIER_HISTORIES,
    );
  }

  public getSupplierHistoryById(id_supplier_history: string) {
    return this.http.get<SupplierHistoryResponse>(
      `${Endpoints.SUPPLIER_HISTORIES}/${id_supplier_history}`,
    );
  }

  public createSupplierHistory(data: SupplierHistoryRequest) {
    return this.http.post<void>(
      Endpoints.SUPPLIER_HISTORIES,
      data,
    );
  }
  
  public updateSupplierHistory(data: SupplierHistoryRequest) {
    return this.http.put<void>(
      Endpoints.SUPPLIER_HISTORIES,
      data,
    );
  }
  
  public deleteSupplierHistory(id_supplier_history: number) {
    return this.http.delete<void>(
      `${Endpoints.SUPPLIER_HISTORIES}/${id_supplier_history}`,
    );
  }
}