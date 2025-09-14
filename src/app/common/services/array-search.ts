import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';

@Injectable({
  providedIn: 'root',
})
export class ArraySearch {
  public search<T>(data: T, keys: string[], searchValue: string) {
    if (!searchValue.length) {
      return data;
    }

    const fuse = new Fuse<T>(data as any, {
      includeScore: true,
      findAllMatches: true,
      ignoreLocation: true,
      threshold: 1,
      keys: keys,
    });
    const list = fuse.search(searchValue);

    const res = list.filter((v) => v.score && v.score < 0.2).map((v) => v.item);

    return res as T;
  }
}
