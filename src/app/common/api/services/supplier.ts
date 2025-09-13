import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { SupplierRequest } from '../interfaces/requests/SupplierRequest';
import { SupplierResponse } from '../interfaces/responses/SupplierResponse';
@Injectable({
  providedIn: 'root',
})
export class Supplier {
     constructor(
    private http: HttpClient,
  ) {}

  public getSuppliers() {
    return this.http.get<SupplierResponse[]>(
      Endpoints.SUPPLIERS,
    );
  }

  public getSupplierById(id_supplier: string) {
    return this.http.get<SupplierResponse>(
      `${Endpoints.SUPPLIERS}/${id_supplier}`,
    );
  }

  public createSupplier(data: SupplierRequest) {
    return this.http.post<void>(
      Endpoints.SUPPLIERS,
      data,
    );
  }
  
  public updateSupplier(data: SupplierRequest) {
    return this.http.put<void>(
      Endpoints.SUPPLIERS,
      data,
    );
  }
  
  public deleteSupplier(id_supplier: number) {
    return this.http.delete<void>(
      `${Endpoints.SUPPLIERS}/${id_supplier}`,
    );
  }
  
}
