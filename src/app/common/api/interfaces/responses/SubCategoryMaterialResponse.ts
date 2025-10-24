import { CategoryResponse } from './CategoryResponse';

export interface SubCategoryMaterialResponse {
  subCategoryMaterialId: number;
  subCategoryName: string;
  categoryId: CategoryResponse;
}
