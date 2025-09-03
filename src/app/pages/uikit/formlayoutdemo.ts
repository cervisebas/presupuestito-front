import { Component } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from "primeng/table";
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';  // <-- Agregado
import { TagModule } from 'primeng/tag';                  // <-- Corregido
import { ToastModule } from 'primeng/toast';              // <-- Corregido
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // <-- Corregido
import { RippleModule } from 'primeng/ripple'; 
// Definición de interfaces (deben estar en este archivo o en otro y luego importadas)
interface Material {
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
}

interface Presupuesto {
    id: string;
    cliente: string;
    detalle: string;
    fecha: Date;
    total: number;
    estado: 'Pendiente' | 'Aceptado';
}
@Component({
    selector: 'app-formlayout-demo',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, TableModule],
    template: `
          <p-fluid>
            <div class="flex flex-col md:flex-row gap-8">
                <!-- FORMULARIO DE PRESUPUESTO -->
                <div class="md:w-11/12">
                    <div class="card flex flex-col gap-6">
                        <div class="font-semibold text-xl">Realizar Presupuesto</div>

                        <!-- Cliente -->
                        <div class="flex flex-col gap-2">
                            <label for="cliente">Cliente</label>
                            <div class="flex">
                                <input
                                    pInputText
                                    id="cliente"
                                    [(ngModel)]="nuevoPresupuesto.cliente"
                                    placeholder="Buscar cliente..."
                                    class="flex-1"
                                />
                                <p-button
                                    icon="pi pi-user-plus"
                                    label="Clientes"
                                    severity="secondary"
                                    styleClass="ml-2"
                                    (onClick)="irAVistaClientes()"
                                />
                            </div>
                        </div>

                        <!-- Detalle -->
                        <div class="flex flex-col gap-2">
                            <label for="detalle">Detalle</label>
                            <input
                                pInputText
                                id="detalle"
                                [(ngModel)]="nuevoPresupuesto.detalle"
                                placeholder="Ej: Bajo Mesada"
                            />
                        </div>

                        <!-- Materiales -->
                        <div class="flex flex-col gap-2">
                            <label>Materiales</label>
                            <p-table [value]="materiales" dataKey="id" responsiveLayout="scroll">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th style="width: 30%">Nombre</th>
                                        <th style="width: 20%">Cantidad</th>
                                        <th style="width: 20%">Precio Unit.</th>
                                        <th style="width: 20%">Total</th>
                                        <th style="width: 10%"></th>
                                    </tr>
                                </ng-template>

                                <ng-template pTemplate="body" let-material let-index="rowIndex">
                                    <tr>
                                        <td>
                                            <input
                                                pInputText
                                                [(ngModel)]="material.nombre"
                                                placeholder="Nombre"
                                                (ngModelChange)="recalcularTotal()"
                                            />
                                        </td>
                                        <td>
                                            <p-inputNumber
                                                [(ngModel)]="material.cantidad"
                                                mode="decimal"
                                                placeholder="0"
                                                (ngModelChange)="recalcularTotal()"
                                            />
                                        </td>
                                        <td>
                                            <p-inputNumber
                                                [(ngModel)]="material.precioUnitario"
                                                mode="currency"
                                                currency="USD"
                                                locale="es-AR"
                                                (ngModelChange)="recalcularTotal()"
                                            />
                                        </td>
                                        <td class="font-medium">
                                            {{ (material.cantidad * material.precioUnitario)  }}
                                        </td>
                                        <td>
                                            <p-button
                                                icon="pi pi-trash"
                                                severity="danger"
                                                [rounded]="true"
                                                [text]="true"
                                                (onClick)="eliminarMaterial(index)"
                                            />
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>

                            <p-button
                                label="Agregar Material"
                                icon="pi pi-plus"
                                severity="info"
                                size="small"
                                (onClick)="agregarMaterial()"
                                class="mt-2"
                            />
                        </div>

                        <!-- Total general -->
                        <div class="flex justify-between font-bold text-lg pt-4 border-t">
                            <span>Total Presupuesto:</span>
                            <span>{{ calcularTotal() }}</span>
                        </div>

                        <p-button
                            label="Guardar Presupuesto"
                            icon="pi pi-save"
                            (onClick)="guardarPresupuesto()"
                            class="mt-3"
                        />
                    </div>
                </div>

                <!-- LISTA DE PRESUPUESTOS -->
                <div class="md:w-11/12">
                    <div class="card flex flex-col gap-6">
                        <div class="font-semibold text-xl">Lista de Presupuestos</div>

                        <p-table
                            [value]="presupuestos"
                            dataKey="id"

                            [rows]="10"
                            [paginator]="true"
                            [rowsPerPageOptions]="[5, 10, 20]"
                        >
                            <ng-template pTemplate="header">
                                <tr>
                                    <th style="width: 20%">Cliente</th>
                                    <th style="width: 25%">Detalle</th>
                                    <th style="width: 15%">Fecha</th>
                                    <th style="width: 15%">Total</th>
                                    <th style="width: 15%">Estado</th>
                                    <th style="width: 10%">Acciones</th>
                                </tr>
                            </ng-template>

                            <ng-template pTemplate="body" let-presupuesto>
                                <tr>
                                    <td>{{ presupuesto.cliente }}</td>
                                    <td>{{ presupuesto.detalle }}</td>
                                    <td>{{ presupuesto.fecha   }}</td>
                                    <td>{{ presupuesto.total }}</td>
                                    
                                    <td class="flex gap-2">
                                        <p-button
                                            icon="pi pi-pencil"
                                            severity="secondary"
                                            [rounded]="true"
                                            [text]="true"
                                            (onClick)="editarPresupuesto(presupuesto)"
                                            tooltip="Editar"
                                        />
                                        <p-button
                                            icon="pi pi-check"
                                            severity="success"
                                            [rounded]="true"
                                            [text]="true"
                                            (onClick)="aceptarPresupuesto(presupuesto)"
                                            [disabled]="presupuesto.estado !== 'Pendiente'"
                                            tooltip="Aceptar y pasar a trabajo"
                                        />
                                        <p-button
                                            icon="pi pi-trash"
                                            severity="danger"
                                            [rounded]="true"
                                            [text]="true"
                                            (onClick)="eliminarPresupuesto(presupuesto)"
                                            tooltip="Eliminar"
                                        />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        </p-fluid>
    
    
    `
})
export class FormLayoutDemo {
    
        // Para el formulario
    nuevoPresupuesto = {
        cliente: '',
        detalle: ''
    };

    materiales: Material[] = [
        { id: this.generarId(), nombre: '', cantidad: 1, precioUnitario: 0 }
    ];

    // Lista de presupuestos
    presupuestos: Presupuesto[] = [
        {
            id: '1',
            cliente: 'Juan Pérez',
            detalle: 'Reparación de techo',
            fecha: new Date(),
            total: 1250,
            estado: 'Pendiente'
        }
    ];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    // --- Materiales ---
    agregarMaterial() {
        this.materiales.push({
            id: this.generarId(),
            nombre: '',
            cantidad: 1,
            precioUnitario: 0
        });
    }

    eliminarMaterial(index: number) {
        this.materiales.splice(index, 1);
        this.recalcularTotal();
    }

    recalcularTotal() {
        // Puedes usarlo si necesitas hacer algo extra al cambiar valores
    }

    calcularTotal(): number {
        return this.materiales.reduce((sum, m) => sum + (m.cantidad * m.precioUnitario), 0);
    }

    guardarPresupuesto() {
        const total = this.calcularTotal();
        if (!this.nuevoPresupuesto.cliente || total <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Faltan datos',
                detail: 'Completa cliente y al menos un material válido'
            });
            return;
        }

        this.presupuestos.push({
            id: this.generarId(),
            cliente: this.nuevoPresupuesto.cliente,
            detalle: this.nuevoPresupuesto.detalle,
            fecha: new Date(),
            total,
            estado: 'Pendiente'
        });
    
        this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Presupuesto creado correctamente'
        });

        // Resetear formulario
        this.nuevoPresupuesto = { cliente: '', detalle: '' };
        this.materiales = [{ id: this.generarId(), nombre: '', cantidad: 1, precioUnitario: 0 }];
    }

    // --- Lista de presupuestos ---
    getSeverity(estado: string) {
        return estado === 'Pendiente' ? 'warning' : 'success';
    }

    editarPresupuesto(presupuesto: Presupuesto) {
        this.nuevoPresupuesto.cliente = presupuesto.cliente;
        this.nuevoPresupuesto.detalle = presupuesto.detalle;
        // Aquí podrías cargar materiales si los tuvieras guardados
        this.messageService.add({ severity: 'info', summary: 'Editar', detail: `Editando ${presupuesto.cliente}` });
    }

        aceptarPresupuesto(presupuesto: Presupuesto) {
        this.confirmationService.confirm({
            message: `¿Aceptar el presupuesto de ${presupuesto.cliente} y pasarlo a trabajos?`,
            header: 'Confirmar Aceptación',
            icon: 'pi pi-check-circle',
            accept: () => {
                presupuesto.estado = 'Aceptado';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `El trabajo para ${presupuesto.cliente} ha sido creado.`
                });
            }
        });
    }

    eliminarPresupuesto(presupuesto: Presupuesto) {
        this.confirmationService.confirm({
            message: `¿Eliminar el presupuesto de ${presupuesto.cliente}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.presupuestos = this.presupuestos.filter(p => p.id !== presupuesto.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Presupuesto eliminado'
                });
            }
        });
    }

    irAVistaClientes() {
        this.messageService.add({ severity: 'info', summary: 'Ir a Clientes', detail: 'Navegando...' });
        // this.router.navigate(['/clientes']);
    }

    generarId(): string {
        return Math.random().toString(36).substring(2, 9);
    }



}
