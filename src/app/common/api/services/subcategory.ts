import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { SubCategoryMaterialRequest } from '../interfaces/requests/SubCategoryMaterialRequest';
import { SubCategoryMaterialResponse } from '../interfaces/responses/SubCategoryMaterialResponse';
@Injectable({
  providedIn: 'root',
})
export class Subcategory {
  constructor(private http: HttpClient) {}

  public getSubcategories() {
    return this.http.get<SubCategoryMaterialResponse[]>(
      Endpoints.SUB_CATEGORIES,
    );
  }

  public getSubcategoryById(id_subcategory: number) {
    return this.http.get<SubCategoryMaterialResponse>(
      `${Endpoints.SUB_CATEGORIES}/${id_subcategory}`,
    );
  }

  public createSubcategory(data: SubCategoryMaterialRequest) {
    return this.http.post<SubCategoryMaterialResponse>(
      Endpoints.SUB_CATEGORIES,
      data,
    );
  }

  public updateSubcategory(data: SubCategoryMaterialRequest) {
    return this.http.put<void>(Endpoints.SUB_CATEGORIES, data);
  }

  public deleteSubcategory(id_subcategory: number) {
    return this.http.delete<void>(
      `${Endpoints.SUB_CATEGORIES}/${id_subcategory}`,
    );
  }
}
