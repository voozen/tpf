import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { App } from '@/app/App';
import { TrackingProvider } from '@/components/tracking/TrackingProvider';
import { AppDataProvider } from '@/contexts/AppDataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <TrackingProvider>
            <App />
            <Toaster position="top-center" richColors closeButton />
          </TrackingProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
