import { Link } from 'react-router-dom';
import { IconSkull as IconFooter } from '../iconos';

const FOOTER_LINKS = [{ label: 'personal', href: '/kimo' }];

export default function MainFooter() {
  return (
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
  );
}
