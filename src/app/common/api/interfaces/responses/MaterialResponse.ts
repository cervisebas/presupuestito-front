import { SubCategoryMaterialResponse } from './SubCategoryMaterialResponse';

export interface MaterialResponse {
    materialId: number;
    materialName: string;
    materialDescription: string;
    materialColor: string;
    materialBrand: string;
    materialMeasure: string;
    materialUnitMeasure: string;
    subCategoryMaterialId: SubCategoryMaterialResponse;
}
