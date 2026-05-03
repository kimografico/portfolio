import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { APP_BASENAME } from './data/config/app';
import './styles/index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={`${APP_BASENAME}/`}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
