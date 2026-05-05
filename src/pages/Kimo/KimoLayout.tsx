import { Outlet, NavLink } from 'react-router-dom';

import {
  IconBook,
  IconBrush,
  IconWorld,
  IconIcons,
  IconFile,
  IconPen,
  IconStar,
} from '../../components/iconos';
import '../../styles/espacio-personal.css';

/**
 * Layout principal para la sección /kimo.
 * Incluye navegación interna para subrutas (books, places).
 */
export default function KimoLayout() {
  return (
    <section className="kimo-section">
      <h1 className="kimo-title">Kimo - Mi espacio personal</h1>
      <nav className="kimo-nav flex w-full justify-between items-center">
        <NavLink
          to="books"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          end
          aria-label="Historial de lectura"
        >
          <IconBook className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Biblioteca</span>
        </NavLink>
        <NavLink
          to="places"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Lugares visitados"
        >
          <IconWorld className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Viajes</span>
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
          to="recent-works"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Trabajos recientes"
        >
          <IconStar className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Recientes</span>
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
          <span className="hidden md:inline">Añadir</span>
        </NavLink>
      </nav>
      <main id="main-content">
        <Outlet />
      </main>
    </section>
  );
}
