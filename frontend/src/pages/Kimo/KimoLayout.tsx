import { Outlet, NavLink } from 'react-router-dom';

/**
 * Layout principal para la sección /kimo.
 * Incluye navegación interna para subrutas (books, places).
 */
export default function KimoLayout() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
      <h1 className="text-3xl md:text-5xl font-semibold mb-8">Kimo - Mis cosas</h1>
      <nav className="flex gap-10 mb-8 border-b border-border">
        <NavLink
          to="books"
          className={({ isActive }) =>
            `pb-2 text-base md:text-xl font-medium transition-all duration-200 border-b-2 ${isActive ? 'text-accent border-accent' : 'text-muted border-transparent hover:border-current'}`
          }
          end
        >
          Historial de lectura
        </NavLink>
        <NavLink
          to="places"
          className={({ isActive }) =>
            `pb-2 text-base md:text-xl font-medium transition-all duration-200 border-b-2 ${isActive ? 'text-accent border-accent' : 'text-muted border-transparent hover:border-current'}`
          }
        >
          Lugares visitados
        </NavLink>
      </nav>
      <main id="main-content">
        <Outlet />
      </main>
    </section>
  );
}
