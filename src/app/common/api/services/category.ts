import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { CategoryRequest } from '../interfaces/requests/CategoryRequest';
import { CategoryResponse } from '../interfaces/responses/CategoryResponse';

@Injectable({
  providedIn: 'root',
})
export class Category {
  constructor(private http: HttpClient) {}

  public getCategories() {
    return this.http.get<CategoryResponse[]>(Endpoints.CATEGORIES);
  }

  public getCategoryById(id_category: string) {
    return this.http.get<CategoryResponse>(
      `${Endpoints.CATEGORIES}/${id_category}`,
    );
  }

  public createCategory(data: CategoryRequest) {
    return this.http.post<void>(Endpoints.CATEGORIES, data);
  }

  public updateCategory(data: CategoryRequest) {
    return this.http.put<void>(Endpoints.CATEGORIES, data);
  }

  public deleteCategory(id_category: number) {
    return this.http.delete<void>(`${Endpoints.CATEGORIES}/${id_category}`);
  }
}
