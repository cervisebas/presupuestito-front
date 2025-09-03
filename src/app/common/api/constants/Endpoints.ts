import { environment } from "src/environments/environment";

const API_BASE_URL = environment.backend_url;

export const Endpoints = {
  // Budget Service
  BUDGET: API_BASE_URL + '/Budget',
  BUDGETS_BY_CLIENT: API_BASE_URL + '/Budget/ByClient',
  BUDGET_PRICE: API_BASE_URL + '/Budget/CalculatePrice',

  CLIENTS: API_BASE_URL + '/Client',
  CLIENT_HISTORIES: API_BASE_URL + '/ClientHistory',
  WORKS: API_BASE_URL + '/Work',
  ITEMS: API_BASE_URL + '/Item',
  MATERIALS: API_BASE_URL + '/Material',
  SUB_CATEGORIES: API_BASE_URL + '/SubCategoryMaterial',
  CATEGORIES: API_BASE_URL + '/Category',
  SUPPLIERS: API_BASE_URL + '/Supplier',
  SUPPLIER_HISTORIES: API_BASE_URL + '/SupplierHistory',
  INVOICES: API_BASE_URL + '/Invoice',
  INVOICE_ITEM: API_BASE_URL + '/InvoiceItem',
  EMPLOYEES: API_BASE_URL + '/Employee',
  EMPLOYEE_HISTORIES: API_BASE_URL + '/EmployeeHistory',
  SALARIES: API_BASE_URL + '/Salary',
  FIXED_COST: API_BASE_URL + '/FixedCost',
  PAYMENTS: API_BASE_URL + '/payments',
}
