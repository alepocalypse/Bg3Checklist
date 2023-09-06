// index.js

import React from 'react';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);