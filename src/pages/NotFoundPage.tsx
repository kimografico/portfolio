import { useNavigate } from 'react-router-dom';
import UIButton from '../components/ui/UIButton';
import '../styles/components/buttonStyles.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" data-id="not-found-page">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-6">
          <span
            className="text-[7rem] font-bold text-border select-none leading-none"
            aria-hidden="true"
          >
            404
          </span>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
              Error — Página no encontrada
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-ink mb-2">
              Esta ruta no existe.
            </h1>
            <p className="text-base text-muted mb-6 max-w-md mx-auto">
              La página que buscas no existe o ha sido movida. Si llegaste aquí desde un enlace,
              puede que esté desactualizado.
            </p>
            <UIButton onClick={() => navigate('/')} link arrowBack dataId="notfound-back-home">
              Volver al inicio
            </UIButton>
          </div>
        </div>
      </main>
    </div>
  );
}
