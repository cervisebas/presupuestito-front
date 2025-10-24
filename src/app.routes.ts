import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardPage } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { ClientPage } from './app/pages/client/client';
import { MaterialPage } from '@/pages/material/material';
import { BudgetPage } from '@/pages/budget/budget';
import { SupplierPage } from '@/pages/supplier/supplier';
import { CategoriesAndSubcategoriesPage } from '@/pages/categories-and-subcategories/categories-and-subcategories';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: DashboardPage },
      { path: 'clients', component: ClientPage },
      { path: 'materials', component: MaterialPage },
      { path: 'budgets', component: BudgetPage },
      { path: 'suppliers', component: SupplierPage },
      {
        path: 'categories-and-subcategories',
        component: CategoriesAndSubcategoriesPage,
      },
    ],
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
