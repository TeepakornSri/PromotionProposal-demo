import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AuthContextProvider from './contexts/AuthContext.jsx';
import PromotionContextProvider from './contexts/PromotionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PromotionContextProvider>
  <AuthContextProvider>
      <App />
  </AuthContextProvider>
  </PromotionContextProvider>
);
