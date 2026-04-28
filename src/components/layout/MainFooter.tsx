import { Link } from 'react-router-dom';
import { IconPirateCoin as IconFooter } from '../iconos';

const FOOTER_LINKS = [{ label: 'personal', href: '/kimo' }];

export default function MainFooter() {
  return (
    <footer className="border-t border-border" data-id="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">© 2026 kimografico</span>
        <nav aria-label="Footer" data-id="footer-nav">
          <ul className="flex items-center gap-6 list-none m-0 p-0" data-id="footer-nav-list">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className="text-xl text-muted hover:text-ink transition-colors duration-150 flex items-center"
                >
                  {label === 'personal' ? (
                    <IconFooter
                      size={32}
                      strokeWidth={0.75}
                      className="inline-block align-middle"
                    />
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
  );
}
