import { Supplier } from '@/common/api/services/supplier';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierTestService {
  constructor(private supplierService: Supplier) {}

  public async createManySuppliers(count: number) {
    for (let i = 0; i < count; i++) {
      try {
        await lastValueFrom(
          this.supplierService.createSupplier({
            nameCompany: `Empresa ${i + 1}`,
            name: `Proveedor ${i}`,
            lastname: `Apellido ${i}`,
            street: `Calle ${i * 100}`,
            streetNumber: String((i + 1) * 9),
            locality: 'Miramar',
            phoneNumber: `2291${String(111111 * (i + 1)).slice(0, 6)}`,
            email: `correo${i}@test.com`,
            dni: String(99999999 * (i + 1)).slice(0, 8),
            cuit: String(99999999999 * (i + 1)).slice(0, 11),
          }),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async deleteAllSuppliers() {
    const suppliers = await lastValueFrom(this.supplierService.getSuppliers());

    for (const supplier of suppliers) {
      try {
        await lastValueFrom(
          this.supplierService.deleteSupplier(supplier.supplierId),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}
