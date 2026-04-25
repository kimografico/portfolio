import { Outlet, NavLink } from 'react-router-dom';
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
        >
          Historial de lectura
        </NavLink>
        <NavLink
          to="places"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
        >
          Lugares visitados
        </NavLink>
        <NavLink
          to="iconos"
          className={({ isActive }) =>
            `kimo-nav-link ${isActive ? 'kimo-nav-link-active' : 'kimo-nav-link-inactive'}`
          }
        >
          Iconos
        </NavLink>
      </nav>
      <main id="main-content">
        <Outlet />
      </main>
    </section>
  );
}
