import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { ClientRequest } from '../interfaces/requests/ClientRequest';
import { ClientResponse } from '../interfaces/responses/ClientResponse';
import { StringUtils } from '@/common/services/string-utils';

@Injectable({
  providedIn: 'root',
})
export class Client {
  constructor(
    private http: HttpClient,
    private stringUtils: StringUtils,
  ) {}

  public getClients() {
    return this.http.get<ClientResponse[]>(Endpoints.CLIENTS);
  }

  public getClientById(id_client: number) {
    return this.http.get<ClientResponse>(`${Endpoints.CLIENTS}/${id_client}`);
  }

  public createClient(data: ClientRequest) {
    return this.http.post<void>(Endpoints.CLIENTS, {
      ...data,
      phoneNumber: this.stringUtils.getNumbers(data.phoneNumber),
      dni: this.stringUtils.getNumbers(data.dni || ''),
      cuit: this.stringUtils.getNumbers(data.cuit || ''),
    });
  }

  public updateClient(data: ClientRequest) {
    return this.http.put<void>(`${Endpoints.CLIENTS}/${data.clientId}`, {
      ...data,
      phoneNumber: this.stringUtils.getNumbers(data.phoneNumber),
      dni: this.stringUtils.getNumbers(data.dni || ''),
      cuit: this.stringUtils.getNumbers(data.cuit || ''),
    });
  }

  public deleteClient(id_client: number) {
    return this.http.delete<void>(`${Endpoints.CLIENTS}/${id_client}`);
  }
}
