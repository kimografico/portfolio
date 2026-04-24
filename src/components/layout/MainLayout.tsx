import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { IconSkull as IconFooter } from '../iconos';

const NAV_LINKS = [
  { label: 'Diseño gráfico', href: '/graphic-design' },
  { label: 'Desarrollo Web', href: '/dev' },
  { label: 'Contacto', href: '/contacto' },
];
const FOOTER_LINKS = [{ label: 'personal', href: '/kimo' }];

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header responsive con menú hamburguesa */}
      <header className="sticky top-0 z-40 bg-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold tracking-tight text-ink text-sm transition-opacity duration-150 hover:opacity-70"
          >
            kimografico
          </Link>
          {/* Menú desktop */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-muted hover:text-ink transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* Menú hamburguesa móvil */}
          <MobileMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer simple */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">© 2026 kimografico</span>
          <nav aria-label="Footer">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-xl text-muted hover:text-ink transition-colors duration-150 flex items-center"
                  >
                    {label === 'personal' ? (
                      <IconFooter size={24} strokeWidth={1} className="inline-block align-middle" />
                    ) : (
                      label
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// Componente menú hamburguesa responsive
function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      {/* Botón hamburguesa accesible */}
      <button
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        style={{ outline: 'none', boxShadow: 'none' }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Menú</span>
        {/* Icono hamburguesa animado */}
        <span
          className="block w-6 h-0.5 bg-ink mb-1 transition-all duration-200"
          style={{ transform: open ? 'rotate(45deg) translateY(8.5px)' : 'none' }}
        />
        <span
          className={`block w-6 h-0.5 bg-ink mb-1 transition-all duration-200 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className="block w-6 h-0.5 bg-ink transition-all duration-200"
          style={{ transform: open ? 'rotate(-45deg) translateY(-8.5px)' : 'none' }}
        />
      </button>
      {/* Menú desplegable */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menú móvil"
          className="absolute left-0 top-14 w-full bg-bg border-b border-border shadow-md z-50"
        >
          <ul className="flex flex-col items-stretch w-full py-2 px-2">
            {NAV_LINKS.map(({ label, href }, idx) => (
              <React.Fragment key={href}>
                <li className="w-full">
                  <Link
                    to={href}
                    className="block px-6 py-5 text-2xl text-ink text-center hover:text-accent transition-colors duration-150"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
                {idx < NAV_LINKS.length - 1 && (
                  <li
                    key={href + '-divider'}
                    aria-hidden="true"
                    className="w-full flex justify-center"
                  >
                    <hr className="w-3/4 border-t border-muted opacity-80 my-2" />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
