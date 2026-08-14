import React, { useEffect } from 'react';
import { useAuthStore } from '../../app/store/useAuthStore';
import { useInventoryStore } from '../../app/store/useInventoryStore';
import { productService } from '../../services/productService';
import { ingredientService } from '../../services/ingredientService';
import { stockService } from '../../services/stockService';
import { supplierService } from '../../services/supplierService';
import { purchaseOrderService } from '../../services/purchaseOrderService';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { setProducts, setIngredients, setStockMovements, setSuppliers, setPurchaseOrders, setIsLoading } = useInventoryStore();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsLoading(true);
      try {
        const [prodRes, ingRes, movRes, supRes, poRes] = await Promise.allSettled([
          productService.getAll(),
          ingredientService.getAll(),
          stockService.getMovements(),
          supplierService.getAll(),
          purchaseOrderService.getAll(),
        ]);

        if (prodRes.status === 'fulfilled') setProducts(prodRes.value);
        if (ingRes.status === 'fulfilled') setIngredients(ingRes.value);
        if (movRes.status === 'fulfilled') setStockMovements(movRes.value);
        if (supRes.status === 'fulfilled') setSuppliers(supRes.value);
        if (poRes.status === 'fulfilled') setPurchaseOrders(poRes.value);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [checkAuth, setProducts, setIngredients, setStockMovements, setSuppliers, setPurchaseOrders, setIsLoading]);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-wide text-slate-300">Memuat JagoGudang...</p>
      </div>
    );
  }

  return <>{children}</>;
};
