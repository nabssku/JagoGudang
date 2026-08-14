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

  setIngredients: (ingredients) =>
    set({ ingredients: Array.isArray(ingredients) ? ingredients : [] }),
  addIngredient: (item) =>
    set((state) => ({ ingredients: [item, ...(Array.isArray(state.ingredients) ? state.ingredients : [])] })),
  updateIngredient: (id, updated) =>
    set((state) => ({
      ingredients: (Array.isArray(state.ingredients) ? state.ingredients : []).map((item) =>
        item.id === id ? { ...item, ...updated } : item
      ),
    })),
  deleteIngredient: (id) =>
    set((state) => ({
      ingredients: (Array.isArray(state.ingredients) ? state.ingredients : []).filter((item) => item.id !== id),
    })),

  setSuppliers: (suppliers) => set({ suppliers: Array.isArray(suppliers) ? suppliers : [] }),
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [supplier, ...(Array.isArray(state.suppliers) ? state.suppliers : [])] })),

  setPurchaseOrders: (purchaseOrders) =>
    set({ purchaseOrders: Array.isArray(purchaseOrders) ? purchaseOrders : [] }),
  addPurchaseOrder: (order) =>
    set((state) => ({ purchaseOrders: [order, ...(Array.isArray(state.purchaseOrders) ? state.purchaseOrders : [])] })),

  setRecipes: (recipes) => set({ recipes: Array.isArray(recipes) ? recipes : [] }),

  setStockMovements: (stockMovements) =>
    set({ stockMovements: Array.isArray(stockMovements) ? stockMovements : [] }),
  addStockMovement: (movement) =>
    set((state) => ({ stockMovements: [movement, ...(Array.isArray(state.stockMovements) ? state.stockMovements : [])] })),

  setIsLoading: (isLoading) => set({ isLoading }),
}));
