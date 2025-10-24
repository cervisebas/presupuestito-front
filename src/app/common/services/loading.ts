import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = false;

  public setLoading(val: boolean) {
    this._loading = val;
  }

  public get loading() {
    return this._loading;
  }
}
