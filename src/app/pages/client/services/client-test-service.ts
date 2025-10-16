import { Client } from '@/common/api/services/client';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientTestService {
  constructor(private clientService: Client) {}

  public async createManyMaterials(count: number) {
    for (let i = 0; i < count; i++) {
      try {
        await lastValueFrom(
          this.clientService.createClient({
            name: `Name ${i}`,
            lastName: `Lastname ${i}`,
            street: `Street ${i * 100}`,
            streetNumber: String(i * 9),
            locality: `Locality ${i}`,
            phoneNumber: String(1111111111 * i),
          }),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}
