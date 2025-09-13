import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { ClientHistoryRequest } from '../interfaces/requests/ClientHistoryRequest';
import { ClientHistoryResponse } from '../interfaces/responses/ClientHistoryResponse';

@Injectable({
  providedIn: 'root'
})
export class ClientHistory {
  constructor(
    private http: HttpClient,
  ) {}

  public getClientHistories() {
    return this.http.get<ClientHistoryResponse[]>(
      Endpoints.CLIENT_HISTORIES,
    );
  }

  public getClientHistoryById(id_client_history: string) {
    return this.http.get<ClientHistoryResponse>(
      `${Endpoints.CLIENT_HISTORIES}/${id_client_history}`,
    );
  }

  public createClientHistory(data: ClientHistoryRequest) {
    return this.http.post<void>(
      Endpoints.CLIENT_HISTORIES,
      data,
    );
  }
  
  public updateClientHistory(data: ClientHistoryRequest) {
    return this.http.put<void>(
      Endpoints.CLIENT_HISTORIES,
      data,
    );
  }
  
  public deleteClientHistory(id_client_history: number) {
    return this.http.delete<void>(
      `${Endpoints.CLIENT_HISTORIES}/${id_client_history}`,
    );
  }
}