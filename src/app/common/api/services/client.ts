import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { ClientRequest } from '../interfaces/requests/ClientRequest';
import { ClientResponse } from '../interfaces/responses/ClientResponse';

@Injectable({
  providedIn: 'root',
})
export class Client {
  constructor(private http: HttpClient) {}

  public getClients() {
    return this.http.get<ClientResponse[]>(Endpoints.CLIENTS);
  }

  public getClientById(id_client: string) {
    return this.http.get<ClientResponse>(`${Endpoints.CLIENTS}/${id_client}`);
  }

  public createClient(data: ClientRequest) {
    return this.http.post<void>(Endpoints.CLIENTS, data);
  }

  public updateClient(data: ClientRequest) {
    return this.http.put<void>(Endpoints.CLIENTS, data);
  }

  public deleteClient(id_client: number) {
    return this.http.delete<void>(`${Endpoints.CLIENTS}/${id_client}`);
  }
}
