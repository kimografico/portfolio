import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { APP_BASENAME } from './data/config/app';
import './styles/index.css';
import App from './App.tsx';
import { BackendStatusProvider } from './contexts/BackendStatusContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendStatusProvider>
      <BrowserRouter
        basename={`${APP_BASENAME}/`}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </BrowserRouter>
    </BackendStatusProvider>
  </StrictMode>,
);
