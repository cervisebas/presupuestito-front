
// Para crear o actualizar
export interface ClienteRequest {
    name: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email?: string;
    dni?: string;
    cuit?: string;
}

// Estructura interna de `personId` en la respuesta
export interface Persona {
    personId: number;
    name: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email: string | null;
    dni: string | null;
    cuit: string | null;
}

// Respuesta completa del cliente
export interface ClienteResponse {
    clientId: number;
    personId: Persona;
}