import { Outlet, NavLink } from 'react-router-dom';

import {
  IconBook,
  IconBrush,
  IconWorld,
  IconIcons,
  IconFile,
  IconPen,
} from '../../components/iconos';
import './espacio-personal.css';

/**
 * Layout principal para la sección /kimo.
 * Incluye navegación interna para subrutas (books, places).
 */
export default function KimoLayout() {
  return (
    <section className="kimo-section">
      <h1 className="kimo-title">Kimo - Mi espacio personal</h1>
      <nav className="kimo-nav">
        <NavLink
          to="books"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          end
          aria-label="Historial de lectura"
        >
          <IconBook className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Historial de lectura</span>
        </NavLink>
        <NavLink
          to="places"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Lugares visitados"
        >
          <IconWorld className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Lugares visitados</span>
        </NavLink>
        <NavLink
          to="ilustraciones"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Ilustraciones"
        >
          <IconBrush className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Ilustraciones</span>
        </NavLink>
        <NavLink
          to="iconos"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Iconos"
        >
          <IconIcons className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Iconos</span>
        </NavLink>
        <NavLink
          to="data"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Datos"
        >
          <IconFile className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Datos</span>
        </NavLink>
        <NavLink
          to="add-project"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Añadir proyecto"
        >
          <IconPen className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Añadir proyecto</span>
        </NavLink>
      </nav>
      <main id="main-content">
        <Outlet />
      </main>
    </section>
  );
}
