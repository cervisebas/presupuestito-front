import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { PaymentResponse } from '../interfaces/responses/PaymentResponse';
import { PaymentRequest } from '../interfaces/requests/PaymentRequest';
@Injectable({
  providedIn: 'root',
})
export class Payment {
  constructor(private http: HttpClient) {}

  public getPayments() {
    return this.http.get<PaymentResponse[]>(Endpoints.PAYMENTS);
  }

  public getPaymentById(id_payment: string) {
    return this.http.get<PaymentResponse>(
      `${Endpoints.PAYMENTS}/${id_payment}`,
    );
  }

  public createPayment(data: PaymentRequest) {
    return this.http.post<void>(Endpoints.PAYMENTS, data);
  }

  public updatePayment(data: PaymentRequest) {
    return this.http.put<void>(Endpoints.PAYMENTS, data);
  }

  public deletePayment(id_payment: number) {
    return this.http.delete<void>(`${Endpoints.PAYMENTS}/${id_payment}`);
  }
}
