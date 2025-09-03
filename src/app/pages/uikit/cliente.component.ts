// src/app/pages/cliente/cliente.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from 'src/app/pages/service/cliente.service';
import { ClienteRequest } from 'src/app/pages/models/cliente.model'; // Usa ClienteRequest
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule
  ],
  // No necesitas providers: MessageService ya está en appConfig
  template: `
    <div class="card p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Crear Cliente</h2>
      <p-toast></p-toast>

      <form [formGroup]="clienteForm" (ngSubmit)="guardarCliente()" class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Nombre (obligatorio) -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="name" id="name" />
            <label for="name">Nombre *</label>
          </p-floatlabel>
          <small class="text-red-500" *ngIf="name.invalid && name.touched">
            Nombre es obligatorio
          </small>
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
          <small class="text-red-500" *ngIf="address.invalid && address.touched">
            Dirección es obligatoria
          </small>
        </div>

        <!-- Celular (obligatorio) -->
        <div>
          <p-floatlabel>
            <input pInputText formControlName="phoneNumber" id="phoneNumber" />
            <label for="phoneNumber">Celular *</label>
          </p-floatlabel>
          <small class="text-red-500" *ngIf="phoneNumber.invalid && phoneNumber.touched">
            Celular es obligatorio
          </small>
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
          <p-button 
            label="Guardar Cliente" 
            icon="pi pi-save" 
            [loading]="loading" 
            type="submit"
            [disabled]="clienteForm.invalid"
          />
        </div>
      </form>
    </div>
  `
})
export class ClienteComponent implements OnInit {
  clienteForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private messageService: MessageService
  ) {
    this.clienteForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.email]],
      dni: [''],
      cuit: ['']
    });
  }

  ngOnInit(): void {}

  // Getters para validación
  get name() { return this.clienteForm.get('name')!; }
  get lastName() { return this.clienteForm.get('lastName')!; }
  get address() { return this.clienteForm.get('address')!; }
  get phoneNumber() { return this.clienteForm.get('phoneNumber')!; }

  guardarCliente() {
    if (this.clienteForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: 'Nombre, apellido, dirección y celular son obligatorios'
      });
      return;
    }

    this.loading = true;

    // El objeto ya está en el formato correcto: name, lastName, phoneNumber, etc.
    const cliente: ClienteRequest = this.clienteForm.value;

    this.clienteService.create(cliente).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cliente creado con ID: ${response.clientId}`
        });
        this.clienteForm.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el cliente: ' + (err.message || 'Error de conexión')
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}