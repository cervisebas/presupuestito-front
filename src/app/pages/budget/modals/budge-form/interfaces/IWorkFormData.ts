export interface IWorkFormData {
  id?: number;

  name: string;
  estimatedHours: number;
  cost: number;
  limitDate: Date;
  notes: string;
  status: string;

  materials: {
    materialName?: string;
    materialId: number | null;
    quantity: number;
    pricePeerUnit?: number;
    priceTotal?: number;
    quantityUnit?: string;
    quantityTotal?: number;
  }[];
}
