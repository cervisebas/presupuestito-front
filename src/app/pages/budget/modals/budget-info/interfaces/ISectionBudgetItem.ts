import { IWorkFormData } from '../../budge-form/interfaces/IWorkFormData';

export interface ISectionBudgetItem {
  title: string;
  total: number;
  subtotal: number;
  endDate: Date;
  startDate: Date;
  items: IWorkFormData['materials'];
}
