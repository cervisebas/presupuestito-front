import { Injectable } from '@angular/core';
import { Endpoints } from '../constants/Endpoints';
import { HttpClient } from '@angular/common/http';
import { StatsResponse } from '../interfaces/responses/StatsResponse';

@Injectable({
  providedIn: 'root',
})
export class Stats {
  constructor(private http: HttpClient) {}

  public getStats() {
    return this.http.get<StatsResponse>(Endpoints.STATS);
  }
}
