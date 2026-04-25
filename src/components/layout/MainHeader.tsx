import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import MobileMenu from '../ui/MobileMenu';

const NAV_LINKS = [
  { label: 'Diseño gráfico', href: '/graphic-design' },
  { label: 'Desarrollo Web', href: '/dev' },
  { label: 'Contacto', href: '/contacto' },
];

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border" data-id="main-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <Logo />
        {/* Menú desktop */}
        <nav aria-label="Principal" className="hidden md:block" data-id="main-nav-desktop">
          <ul className="flex items-center gap-6 list-none m-0 p-0" data-id="main-nav-desktop-list">
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
        <MobileMenu navLinks={NAV_LINKS} data-id="main-menu-mobile" />
      </div>
    </header>
  );
}
