import { Link } from 'react-router-dom';
import '../../styles/components/MainHeader.css';
import { LogoKimografico } from '../iconos';
import MobileMenu from '../ui/MobileMenu';
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Diseño gráfico', href: '/graphic-design' },
  { label: 'Desarrollo Web', href: '/dev' },
  { label: 'Contacto', href: '/contacto' },
];

export default function MainHeader() {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border" data-id="main-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <Link to="/" className="logo-link" aria-label="Ir a inicio" data-id="logo-link">
          <LogoKimografico size={200} className="text-current" />
        </Link>
        <div className="flex items-center gap-6">
          {/* Menú desktop */}
          <nav aria-label="Principal" className="hidden md:block" data-id="main-nav-desktop">
            <ul
              className="flex items-center gap-6 list-none m-0 p-0"
              data-id="main-nav-desktop-list"
            >
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
          {/* Toggle tema claro/oscuro */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}
            className="p-2 rounded-full text-muted hover:text-ink transition-colors duration-150"
            data-id="theme-toggle-btn"
          >
            {theme === 'light' ? (
              /* Luna (dark mode) */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* Sol (light mode) */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          {/* Menú hamburguesa móvil */}
          <MobileMenu navLinks={NAV_LINKS} data-id="main-menu-mobile" />
        </div>
      </div>
    </header>
  );
}
