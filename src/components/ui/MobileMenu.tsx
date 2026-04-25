import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MobileMenuProps } from '../../interfaces/ui';

const ANIMATION_DURATION = 400;

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Al abrir, activa la animación de entrada tras montar
  React.useEffect(() => {
    if (showMenu && !isEntering && !isExiting) {
      const t = setTimeout(() => setIsEntering(true), 10);
      return () => clearTimeout(t);
    }
    // Al cerrar, desmonta tras la animación
    if (isExiting) {
      const t = setTimeout(() => {
        setShowMenu(false);
        setIsExiting(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(t);
    }
  }, [showMenu, isEntering, isExiting]);

  const openMenu = () => {
    setShowMenu(true);
    setIsEntering(false);
    setIsExiting(false);
  };

  const closeMenu = () => {
    setIsExiting(true);
    setIsEntering(false);
  };

  return (
    <div className="md:hidden">
      {/* Botón hamburguesa accesible */}
      <button
        aria-label={showMenu ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={showMenu}
        aria-controls="mobile-menu"
        className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        style={{ outline: 'none', boxShadow: 'none' }}
        onClick={() => {
          if (!showMenu) openMenu();
          else closeMenu();
        }}
      >
        <span className="sr-only">Menú</span>
        {/* Icono hamburguesa animado */}
        <span
          className="block w-6 h-0.5 bg-ink mb-1 transition-all duration-200"
          style={{ transform: showMenu ? 'rotate(45deg) translateY(8.5px)' : 'none' }}
        />
        <span
          className={`block w-6 h-0.5 bg-ink mb-1 transition-all duration-200 ${showMenu ? 'opacity-0' : ''}`}
        />
        <span
          className="block w-6 h-0.5 bg-ink transition-all duration-200"
          style={{ transform: showMenu ? 'rotate(-45deg) translateY(-8.5px)' : 'none' }}
        />
      </button>

      {/* Menú desplegable animado */}
      {showMenu && (
        <nav
          id="mobile-menu"
          aria-label="Menú móvil"
          className={`absolute left-0 top-14 w-full bg-bg border-b border-border shadow-md z-50 transition-all duration-200 ease-out
            ${isEntering && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <ul className="flex flex-col items-stretch w-full py-2 px-2">
            {navLinks.map(({ label, href }, idx) => (
              <React.Fragment key={href}>
                <li className="w-full">
                  <Link
                    to={href}
                    className="block px-6 py-5 text-2xl text-ink text-center hover:text-accent transition-colors duration-150"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
                {idx < navLinks.length - 1 && (
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
