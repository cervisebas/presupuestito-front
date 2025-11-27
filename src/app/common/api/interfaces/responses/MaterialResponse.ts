import { SubCategoryMaterialResponse } from './SubCategoryMaterialResponse';

export interface MaterialResponse {
  materialId: number;
  price: number;
  materialName: string;
  materialDescription?: string;
  materialColor?: string;
  materialBrand?: string;
  materialMeasure?: string;
  materialUnitMeasure?: string;
  subCategoryMaterialId: SubCategoryMaterialResponse;
}
