import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { WorkRequest } from '../interfaces/requests/WorkRequest';
import { WorkResponse } from '../interfaces/responses/WorkResponse';
@Injectable({
  providedIn: 'root',
})
export class Work {
  constructor(private http: HttpClient) {}

  public getWorks() {
    return this.http.get<WorkResponse[]>(Endpoints.WORKS);
  }

  public getWorkById(id_work: string) {
    return this.http.get<WorkResponse>(`${Endpoints.WORKS}/${id_work}`);
  }

  public createWork(data: WorkRequest) {
    return this.http.post<WorkResponse>(Endpoints.WORKS, data);
  }

  public updateWork(data: WorkRequest) {
    return this.http.put<void>(Endpoints.WORKS, data);
  }

  public deleteWork(id_work: number) {
    return this.http.delete<void>(`${Endpoints.WORKS}/${id_work}`);
  }
}
