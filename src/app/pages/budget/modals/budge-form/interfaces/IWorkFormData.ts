export interface IWorkFormData {
  id?: number;

  name: string;
  estimatedHours: number;
  limitDate: Date;
  notes: string;
  status: string;

  materials: {
    materialId: number | null;
    quantity: number;
  }[];
}
