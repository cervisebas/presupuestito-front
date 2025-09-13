import { MaterialResponse } from './MaterialResponse';

export interface ItemResponse {
  itemId: number;
  oMaterial: MaterialResponse;
  quantity: number;
}
