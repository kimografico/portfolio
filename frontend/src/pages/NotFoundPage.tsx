import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold tracking-tight text-ink text-sm transition-opacity duration-150 hover:opacity-70"
          >
            kimografico
          </Link>
        </div>
      </header>

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
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink border border-ink px-5 py-2 rounded transition-opacity duration-150 hover:opacity-70"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 h-14 flex items-center">
        <span className="font-mono text-xs text-muted">© 2026 kimografico</span>
      </footer>
    </div>
  );
}
