import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteRequest, ClienteResponse } from '../models/cliente.model';

@Injectable({
  providedIn: 'root' // Asegura que el servicio esté disponible globalmente
})
export class ClienteService {
  private baseUrl = 'https://tu-api.com/api/Client'; // Cambia por tu URL real

  constructor(private http: HttpClient) {}

  // POST: Crear un nuevo cliente
  create(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.baseUrl, cliente);
  }

  // GET: Obtener todos los clientes
  getAll(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.baseUrl);
  }

  // GET: Obtener un cliente por ID
  getById(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/${id}`);
  }

  // PUT: Actualizar un cliente completo
  update(id: number, cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.baseUrl}/${id}`, cliente);
  }

  // PATCH: Actualización parcial (opcional, si se implementa)
  // Ejemplo: solo cambiar el teléfono
  partialUpdate(id: number, data: Partial<ClienteRequest>): Observable<ClienteResponse> {
    return this.http.patch<ClienteResponse>(`${this.baseUrl}/${id}`, data);
  }
}