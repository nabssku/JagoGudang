import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { router } from './app/router';
import { AppInitializer } from './components/shared/AppInitializer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppInitializer>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </AppInitializer>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
