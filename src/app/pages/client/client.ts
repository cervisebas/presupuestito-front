import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ClientRequest } from '@/common/api/interfaces/requests/ClientRequest';
import { Client } from '@/common/api/services/client';

@Component({
  selector: 'app-client',
  imports: [Toast, Button, FormsModule, FloatLabelModule, InputTextModule, ReactiveFormsModule],
  providers: [MessageService],
  template: `
    <div class="card p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Crear Cliente</h2>
      <p-toast />

      <form [formGroup]="clienteForm" (ngSubmit)="guardarCliente()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre (obligatorio) -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="name" id="name" />
            <label for="name">Nombre *</label>
          </p-floatlabel>

          @if (name.invalid && name.touched) {
            <small class="text-red-500"> Nombre es obligatorio </small>
          }
        </div>

        <!-- Apellido -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="lastName" id="lastName" />
            <label for="lastName">Apellido</label>
          </p-floatlabel>
        </div>

        <!-- Dirección (address) -->
        <div class="md:col-span-2">
          <p-floatlabel>
            <input pInputText formControlName="address" id="address" />
            <label for="address">Dirección *</label>
          </p-floatlabel>

          @if (address.invalid && address.touched) {
            <small class="text-red-500"> Dirección es obligatoria </small>
          }
        </div>

        <!-- Celular (obligatorio) -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="phoneNumber" id="phoneNumber" />
            <label for="phoneNumber">Celular *</label>
          </p-floatlabel>

          @if (phoneNumber.invalid && phoneNumber.touched) {
            <small class="text-red-500"> Celular es obligatorio </small>
          }
        </div>

        <!-- Correo -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="email" id="email" type="email" />
            <label for="email">Correo</label>
          </p-floatlabel>
        </div>

        <!-- DNI -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="dni" id="dni" />
            <label for="dni">DNI</label>
          </p-floatlabel>
        </div>

        <!-- CUIT -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="cuit" id="cuit" />
            <label for="cuit">CUIT</label>
          </p-floatlabel>
        </div>

        <!-- Botón -->
        <div class="md:col-span-2 mt-4">
          <p-button label="Guardar Cliente" icon="pi pi-save" [loading]="loading" type="submit" [disabled]="clienteForm.invalid" />
        </div>
      </form>
    </div>
  `,
})
export class ClientPage {
  protected clienteForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    dni: new FormControl(''),
    cuit: new FormControl(''),
  });
  protected loading = false;

  constructor(
    private clienteService: Client,
    private messageService: MessageService,
  ) {}

  // Getters para validación
  get name() {
    return this.clienteForm.get('name')!;
  }
  get lastName() {
    return this.clienteForm.get('lastName')!;
  }
  get address() {
    return this.clienteForm.get('address')!;
  }
  get phoneNumber() {
    return this.clienteForm.get('phoneNumber')!;
  }

  protected guardarCliente() {
    if (this.clienteForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: 'Nombre, apellido, dirección y celular son obligatorios',
      });

      return;
    }

    this.loading = true;

    // El objeto ya está en el formato correcto: name, lastName, phoneNumber, etc.
    const cliente = this.clienteForm.value as ClientRequest;

    this.clienteService.createClient(cliente).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cliente creado con ID: ${response}`,
        });
        this.clienteForm.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el cliente: ' + (err.message || 'Error de conexión'),
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
