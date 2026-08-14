export type UserRole = 'owner' | 'admin' | 'cashier' | 'kitchen' | 'inventory_manager' | 'super_admin';

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  tenant_id: string;
  outlet_id?: string;
  name: string;
  email: string;
  image?: string | null;
  is_active: boolean;
  pin_enabled?: boolean;
  roles?: Role[];
  tenant?: Tenant;
  outlet?: Outlet;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface Outlet {
  id: string;
  tenant_id: string;
  name: string;
  business_type?: 'fnb' | 'retail';
  address?: string;
  phone?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  category_id: string;
  outlet_id?: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  cost_price?: number;
  stock: number;
  min_stock: number;
  image?: string | null;
  is_active: boolean;
  has_recipe?: boolean;
  category?: Category;
}

export interface Ingredient {
  id: string;
  tenant_id: string;
  outlet_id?: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  current_stock: number;
  min_stock: number;
  category?: string;
  created_at: string;
  updated_at?: string;
}

export interface RecipeItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  ingredient?: Ingredient;
}

export interface Recipe {
  id: string;
  product_id: string;
  product_name?: string;
  yield: number;
  items: RecipeItem[];
  created_at?: string;
}

export type StockMovementType = 'in' | 'out' | 'adjustment' | 'waste';

export interface StockMovement {
  id: string;
  ingredient_id: string;
  type: StockMovementType;
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  notes?: string;
  created_at: string;
  user_name?: string;
  ingredient?: Ingredient;
}

export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface PurchaseOrderItem {
  id?: string;
  ingredient_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  ingredient?: Ingredient;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  tenant_id: string;
  supplier_id: string;
  outlet_id?: string;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  total_amount: number;
  notes?: string;
  order_date: string;
  received_date?: string;
  supplier?: Supplier;
  items: PurchaseOrderItem[];
  created_at: string;
}

export interface StockOpnameItem {
  ingredient_id: string;
  system_stock: number;
  actual_stock: number;
  difference: number;
  notes?: string;
  ingredient?: Ingredient;
}

export interface StockOpname {
  id: string;
  opname_number: string;
  date: string;
  performed_by: string;
  status: 'draft' | 'completed';
  notes?: string;
  items: StockOpnameItem[];
  created_at: string;
}
