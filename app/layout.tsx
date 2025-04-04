'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>CryptoWeather Nexus</title>
        <meta name="description" content="Real-time cryptocurrency and weather dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
