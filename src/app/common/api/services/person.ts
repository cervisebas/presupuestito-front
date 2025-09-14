import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/Endpoints';
import { PersonRequest } from '../interfaces/requests/PersonRequest';
import { PersonResponse } from '../interfaces/responses/PersonResponse';
@Injectable({
  providedIn: 'root',
})
export class Person {
  constructor(private http: HttpClient) {}

  public getPersons() {
    return this.http.get<PersonResponse[]>(Endpoints.PERSONS);
  }

  public getPersonById(id_person: string) {
    return this.http.get<PersonResponse>(`${Endpoints.PERSONS}/${id_person}`);
  }

  public createPerson(data: PersonRequest) {
    return this.http.post<void>(Endpoints.PERSONS, data);
  }

  public updatePerson(data: PersonRequest) {
    return this.http.put<void>(Endpoints.PERSONS, data);
  }

  public deletePerson(id_person: number) {
    return this.http.delete<void>(`${Endpoints.PERSONS}/${id_person}`);
  }
}
