import { Outlet, NavLink } from 'react-router-dom';

import {
  IconBook,
  IconBrush,
  IconWorld,
  IconSpots,
  IconTable,
  IconFile,
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
      <nav
        className="kimo-nav flex w-full justify-between items-center"
        aria-label="Sección personal"
      >
        <NavLink
          to="books"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          end
          aria-label="Historial de lectura"
          data-id="kimo-nav-books"
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
          data-id="kimo-nav-places"
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
          data-id="kimo-nav-ilustraciones"
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
          data-id="kimo-nav-iconos"
        >
          <IconSpots className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Iconos</span>
        </NavLink>
        <NavLink
          to="resume"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Curriculum"
          data-id="kimo-nav-resume"
        >
          <IconFile className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Curriculum</span>
        </NavLink>
        <NavLink
          to="data"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
          aria-label="Datos"
          data-id="kimo-nav-data"
        >
          <IconTable className="inline md:hidden" size={32} strokeWidth={1} />
          <span className="hidden md:inline">Proyectos</span>
        </NavLink>
      </nav>
      <section>
        <Outlet />
      </section>
    </section>
  );
}
