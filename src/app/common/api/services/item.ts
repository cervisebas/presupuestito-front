import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { ItemRequest } from '../interfaces/requests/ItemRequest';
import { ItemResponse } from '../interfaces/responses/ItemResponse';

@Injectable({
  providedIn: 'root',
})
export class Item {
  constructor(private http: HttpClient) {}

  public getItems() {
    return this.http.get<ItemResponse[]>(Endpoints.ITEMS);
  }

  public getItemById(id_item: number) {
    return this.http.get<ItemResponse>(`${Endpoints.ITEMS}/${id_item}`);
  }

  public createItem(data: ItemRequest) {
    return this.http.post<void>(Endpoints.ITEMS, data);
  }

  public updateItem(id_item: number, data: ItemRequest) {
    return this.http.put<void>(`${Endpoints.ITEMS}/${id_item}`, data);
  }

  public deleteItem(id_item: number) {
    return this.http.delete<void>(`${Endpoints.ITEMS}/${id_item}`);
  }
}
