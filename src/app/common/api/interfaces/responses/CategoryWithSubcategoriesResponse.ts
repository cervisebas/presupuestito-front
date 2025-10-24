import { CategoryResponse } from './CategoryResponse';
import { SubCategoryMaterialResponse } from './SubCategoryMaterialResponse';

export interface CategoryWithSubcategoriesResponse extends CategoryResponse {
  subCategories: SubCategoryMaterialResponse[];
}
