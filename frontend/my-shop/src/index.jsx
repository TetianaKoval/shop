import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartProvider.jsx';

createRoot(document.querySelector('#root')).render(
  <CartProvider>
      <App />
  </CartProvider>
);
