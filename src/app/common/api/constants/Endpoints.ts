import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.backend_url;

export const Endpoints = {
  // Budget Service
  BUDGET: API_BASE_URL + '/Budget',
  BUDGET_UPDATE_PRICES: API_BASE_URL + '/Budget/UpdateItemPrices',
  BUDGETS_BY_CLIENT: API_BASE_URL + '/Budget/ByClient',
  BUDGET_PRICE: API_BASE_URL + '/Budget/CalculatePrice',

  // Client Service
  CLIENTS: API_BASE_URL + '/Client',
  CLIENT_HISTORIES: API_BASE_URL + '/ClientHistory',

  COSTS: API_BASE_URL + '/Cost',
  WORKS: API_BASE_URL + '/Work',
  ITEMS: API_BASE_URL + '/Item',
  MATERIALS: API_BASE_URL + '/Material',
  SUB_CATEGORIES: API_BASE_URL + '/SubCategoryMaterial',
  CATEGORIES: API_BASE_URL + '/Category',
  CATEGORIES_WITH_SUBCATEGORIES: API_BASE_URL + '/Category/WithSubcategory',
  SUPPLIERS: API_BASE_URL + '/Supplier',
  SUPPLIER_HISTORIES: API_BASE_URL + '/SupplierHistory',
  INVOICES: API_BASE_URL + '/Invoice',
  INVOICES_BY_SUPPLIER: API_BASE_URL + '/Invoice/BySupplier',
  INVOICE_ITEM: API_BASE_URL + '/InvoiceItem',
  EMPLOYEES: API_BASE_URL + '/Employee',
  EMPLOYEE_HISTORIES: API_BASE_URL + '/EmployeeHistory',
  SALARIES: API_BASE_URL + '/Salary',
  FIXED_COST: API_BASE_URL + '/FixedCost',
  PAYMENTS: API_BASE_URL + '/Payments',
  PERSONS: API_BASE_URL + '/Person',
  PERSONS_LOCALITIES: API_BASE_URL + '/Person/Localities',
  STATS: API_BASE_URL + '/Stats',

  // Setting Service
  SETTINGS: API_BASE_URL + '/Setting',
};
