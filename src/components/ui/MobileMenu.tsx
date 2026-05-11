import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MobileMenuProps } from '../../interfaces/ui';

const ANIMATION_DURATION = 400;

export default function MobileMenu({ navLinks, dataId = 'main-menu-mobile' }: MobileMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Al abrir, activa la animación de entrada tras montar
  useEffect(() => {
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

  const openMenu = useCallback(() => {
    setShowMenu(true);
    setIsEntering(false);
    setIsExiting(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsExiting(true);
    setIsEntering(false);
  }, []);

  useEffect(() => {
    if (!showMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMenu, closeMenu]);

  return (
    <div className="md:hidden" data-id={dataId}>
      {/* Botón hamburguesa accesible */}
      <button
        type="button"
        aria-label={showMenu ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={showMenu}
        aria-controls="mobile-menu"
        className="p-2 rounded focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => {
          if (!showMenu) openMenu();
          else closeMenu();
        }}
        data-id="mobile-menu-button"
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
          data-id="mobile-menu-nav"
        >
          <ul className="flex flex-col items-stretch w-full py-2 px-2" data-id="mobile-menu-list">
            {navLinks.map(({ label, href }, idx) => (
              <Fragment key={href}>
                <li className="w-full">
                  <Link
                    to={href}
                    className="block px-6 py-5 text-2xl text-ink text-center hover:text-accent transition-colors duration-150"
                    onClick={closeMenu}
                    data-id={`mobile-menu-link-${href.replace(/^\//, '').replace(/\//g, '-')}`}
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
                    <hr
                      className="w-3/4 border-t border-muted opacity-80 my-2"
                      data-id={`mobile-menu-divider-${idx}`}
                    />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
