import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { CategoryRequest } from '../interfaces/requests/CategoryRequest';
import { CategoryResponse } from '../interfaces/responses/CategoryResponse';
import { CategoryWithSubcategoriesResponse } from '../interfaces/responses/CategoryWithSubcategoriesResponse';

@Injectable({
  providedIn: 'root',
})
export class Category {
  constructor(private http: HttpClient) {}

  public getCategories() {
    return this.http.get<CategoryResponse[]>(Endpoints.CATEGORIES);
  }

  public getCategoriesWithSuncategories() {
    return this.http.get<CategoryWithSubcategoriesResponse[]>(
      Endpoints.CATEGORIES_WITH_SUBCATEGORIES,
    );
  }

  public getCategoryById(id_category: number) {
    return this.http.get<CategoryResponse>(
      `${Endpoints.CATEGORIES}/${id_category}`,
    );
  }

  public createCategory(data: CategoryRequest) {
    return this.http.post<CategoryResponse>(Endpoints.CATEGORIES, data);
  }

  public updateCategory(id_category: number, data: CategoryRequest) {
    return this.http.put<void>(`${Endpoints.CATEGORIES}/${id_category}`, data);
  }

  public deleteCategory(id_category: number) {
    return this.http.delete<void>(`${Endpoints.CATEGORIES}/${id_category}`);
  }
}
