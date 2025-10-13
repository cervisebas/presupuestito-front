export interface IWorkFormData {
  id?: number;
  alreadyExist?: boolean;

  remove?: boolean;

  name: string;
  estimatedHours: number;
  cost: number;
  limitDate: Date;
  notes: string;
  status: string;

  materials: {
    itemId?: number;
    alreadyExist?: boolean;
    remove?: boolean;
    materialName?: string;
    materialId: number | null;
    quantity: number;
    pricePeerUnit?: number;
    priceTotal?: number;
    quantityUnit?: string;
    quantityTotal?: number;
  }[];
}
