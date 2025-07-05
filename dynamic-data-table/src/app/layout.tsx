'use client';

import { ReactNode } from 'react';
import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProviderWrapper } from '@/theme/ThemeContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProviderWrapper>
              {children}
            </ThemeProviderWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
