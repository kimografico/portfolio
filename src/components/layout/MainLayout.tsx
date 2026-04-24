import { Outlet, Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Diseño gráfico', href: '/graphic-design' },
  { label: 'Desarrollo Web', href: '/dev' },
  { label: 'Contacto', href: '/contacto' },
  { label: '💀', href: '/kimo' },
];

export default function MainLayout() {
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
          <nav aria-label="Principal">
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
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between border-t border-border">
          <span className="font-mono text-xs text-muted">© 2026 kimografico</span>
          <nav aria-label="Footer">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-xs text-muted hover:text-ink transition-colors duration-150"
                  >
                    {label}
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
