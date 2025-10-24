import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { SupplierRequest } from '../interfaces/requests/SupplierRequest';
import { SupplierResponse } from '../interfaces/responses/SupplierResponse';
import { StringUtils } from '@/common/services/string-utils';
@Injectable({
  providedIn: 'root',
})
export class Supplier {
  constructor(
    private http: HttpClient,
    private stringUtils: StringUtils,
  ) {}

  public getSuppliers() {
    return this.http.get<SupplierResponse[]>(Endpoints.SUPPLIERS);
  }

  public getSupplierById(id_supplier: string) {
    return this.http.get<SupplierResponse>(
      `${Endpoints.SUPPLIERS}/${id_supplier}`,
    );
  }

  public createSupplier(data: SupplierRequest) {
    return this.http.post<void>(Endpoints.SUPPLIERS, {
      ...data,
      phoneNumber: this.stringUtils.getNumbers(data.phoneNumber),
      dni: this.stringUtils.getNumbers(data.dni),
      cuit: this.stringUtils.getNumbers(data.cuit),
    });
  }

  public updateSupplier(data: SupplierRequest) {
    return this.http.put<void>(`${Endpoints.SUPPLIERS}/${data.supplierId}`, {
      ...data,
      phoneNumber: this.stringUtils.getNumbers(data.phoneNumber),
      dni: this.stringUtils.getNumbers(data.dni),
      cuit: this.stringUtils.getNumbers(data.cuit),
    });
  }

  public deleteSupplier(id_supplier: number) {
    return this.http.delete<void>(`${Endpoints.SUPPLIERS}/${id_supplier}`);
  }
}
