export interface ClientRequest {
  clientId?: number;
  name: string;
  lastName: string;
  street: string;
  streetNumber: string;
  locality: string;
  phoneNumber: string;
  email?: string;
  dni?: string;
  cuit?: string;
}
