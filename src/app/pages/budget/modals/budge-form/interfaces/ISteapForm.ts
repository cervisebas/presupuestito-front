export interface ISteapForm<T extends object> {
  getData(): T;
  setData?(data: T): void;
}
