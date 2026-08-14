import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { IngredientsPage } from '../../pages/IngredientsPage';
import { StockMovementsPage } from '../../pages/StockMovementsPage';
import { StockOpnamePage } from '../../pages/StockOpnamePage';
import { RecipesPage } from '../../pages/RecipesPage';
import { PurchaseOrdersPage } from '../../pages/PurchaseOrdersPage';
import { SuppliersPage } from '../../pages/SuppliersPage';
import { SettingsPage } from '../../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/ingredients', element: <IngredientsPage /> },
          { path: '/stock-movements', element: <StockMovementsPage /> },
          { path: '/stock-opname', element: <StockOpnamePage /> },
          { path: '/recipes', element: <RecipesPage /> },
          { path: '/purchase-orders', element: <PurchaseOrdersPage /> },
          { path: '/suppliers', element: <SuppliersPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <LoginPage />,
  },
]);
