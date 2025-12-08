import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../constants/Endpoints';
import { SettingResponse } from '../interfaces/responses/SettingResponse';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  constructor(private http: HttpClient) {}

  public setValue(label: string, value: string) {
    return this.http.put(`${Endpoints.SETTINGS}/${label}`, {
      Label: label,
      Value: String(value),
    });
  }

  public getValue(label: string) {
    return this.http.get<SettingResponse>(`${Endpoints.SETTINGS}/${label}`);
  }
}
