import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { MaterialRequest } from '../interfaces/requests/MaterialRequest';
import{ MaterialResponse } from '../interfaces/responses/MaterialResponse';
@Injectable({
  providedIn: 'root'
})
export class Material {
    constructor(
    private http: HttpClient,
  ) {}

  public getMaterials() {
    return this.http.get<MaterialResponse[]>(
      Endpoints.MATERIALS,
    );
  }

  public getMaterialById(id_material: string) {
    return this.http.get<MaterialResponse>(
      `${Endpoints.MATERIALS}/${id_material}`,
    );
  }

  public createMaterial(data: MaterialRequest) {
    return this.http.post<void>(
      Endpoints.MATERIALS,
      data,
    );
  }
  
  public updateMaterial(data: MaterialRequest) {
    return this.http.put<void>(
      Endpoints.MATERIALS,
      data,
    );
  }
  
  public deleteMaterial(id_material: number) {
    return this.http.delete<void>(
      `${Endpoints.MATERIALS}/${id_material}`,
    );
  }
  
  
}
