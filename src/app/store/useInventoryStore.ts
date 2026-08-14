import { create } from 'zustand';
import type { Ingredient, Supplier, PurchaseOrder, Recipe, StockMovement } from '../../types';

interface InventoryState {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  recipes: Recipe[];
  stockMovements: StockMovement[];
  isLoading: boolean;
  setIngredients: (items: Ingredient[]) => void;
  addIngredient: (item: Ingredient) => void;
  updateIngredient: (id: string, item: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  addPurchaseOrder: (order: PurchaseOrder) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setStockMovements: (movements: StockMovement[]) => void;
  addStockMovement: (movement: StockMovement) => void;
  setIsLoading: (status: boolean) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  ingredients: [],
  suppliers: [],
  purchaseOrders: [],
  recipes: [],
  stockMovements: [],
  isLoading: false,

  setIngredients: (ingredients) => set({ ingredients }),
  addIngredient: (item) => set((state) => ({ ingredients: [item, ...state.ingredients] })),
  updateIngredient: (id, updated) =>
    set((state) => ({
      ingredients: state.ingredients.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    })),
  deleteIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter((item) => item.id !== id),
    })),

  setSuppliers: (suppliers) => set({ suppliers }),
  addSupplier: (supplier) => set((state) => ({ suppliers: [supplier, ...state.suppliers] })),

  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
  addPurchaseOrder: (order) => set((state) => ({ purchaseOrders: [order, ...state.purchaseOrders] })),

  setRecipes: (recipes) => set({ recipes }),

  setStockMovements: (stockMovements) => set({ stockMovements }),
  addStockMovement: (movement) => set((state) => ({ stockMovements: [movement, ...state.stockMovements] })),

  setIsLoading: (isLoading) => set({ isLoading }),
}));
