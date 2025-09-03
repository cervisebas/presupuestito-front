import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { ClienteComponent } from './uikit/cliente.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'clientes', component: ClienteComponent},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
