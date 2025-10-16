import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardPage } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { ClientPage } from './app/pages/client/client';
import { MaterialPage } from '@/pages/material/material';
import { SupplierPage } from '@/pages/supplier/supplier';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: DashboardPage },
      { path: 'clients', component: ClientPage },
      { path: 'materials', component: MaterialPage },
      { path: 'suppliers', component: SupplierPage },
    ],
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
