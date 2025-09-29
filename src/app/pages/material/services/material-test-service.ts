import { Category } from '@/common/api/services/category';
import { Material } from '@/common/api/services/material';
import { Subcategory } from '@/common/api/services/subcategory';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaterialTestService {
  constructor(
    private material: Material,
    private category: Category,
    private subcategory: Subcategory,
  ) {}

  private async getOrCreateCategory() {
    try {
      await lastValueFrom(this.category.getCategoryById(1));

      return 1;
    } catch (error) {
      console.error(error);

      const category = await lastValueFrom(
        this.category.createCategory({
          CategoryName: 'Test 1',
        }),
      );

      return category.categoryId;
    }
  }

  private async getOrCreateSubcategory() {
    try {
      await lastValueFrom(this.subcategory.getSubcategoryById(1));

      return 1;
    } catch (error) {
      const categoryId = await this.getOrCreateCategory();

      const subcategory = await lastValueFrom(
        this.subcategory.createSubcategory({
          subCategoryName: 'Test 1',
          categoryId: categoryId,
        }),
      );

      return subcategory.subCategoryMaterialId;
    }
  }

  public async createManyMaterials(count: number) {
    const subcategoryId = await this.getOrCreateSubcategory();

    for (let i = 0; i < count; i++) {
      try {
        await lastValueFrom(
          this.material.createMaterial({
            price: 100 * i,
            MaterialName: `Material ${i}`,
            MaterialDescription: `Descripción random ${i}`,
            MaterialColor: `Color ${i}`,
            MaterialBrand: `Marca N°${i}`,
            MaterialMeasure: String(10 * i + 1),
            MaterialUnitMeasure: 'cm',
            SubCategoryMaterialId: subcategoryId,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}
