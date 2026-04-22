import recentWorks from '../../data/recent-works.json';

const mockProjects = recentWorks;

export default function Home() {
  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-ink focus:border focus:border-border focus:rounded-sm text-sm"
      >
        Saltar al contenido principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-semibold tracking-tight text-ink text-sm transition-opacity duration-150 hover:opacity-70"
          >
            kimografico
          </a>
          <nav aria-label="Principal">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {(
                [
                  { label: 'Diseño', href: '/diseno' },
                  { label: 'Dev', href: '/dev' },
                  { label: 'Contacto', href: '/contacto' },
                ] as const
              ).map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-muted hover:text-ink transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
              <div className="animate-fade-up">
                <p className="font-mono text-xs tracking-widest uppercase text-muted mb-10">
                  Portfolio — 2026
                </p>
                <h1
                  id="hero-heading"
                  className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-ink mb-8"
                >
                  Diseñador gráfico
                  <br />
                  {'&'} desarrollador
                  <br />
                  de software.
                </h1>
                <p className="text-base leading-relaxed text-muted max-w-[52ch] mb-12">
                  Trabajo en la intersección entre diseño visual y código. Un espacio para mostrar
                  proyectos, procesos y el trabajo del día a día.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/diseno"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted border border-border px-5 py-2.5 hover:border-ink hover:text-ink transition-colors duration-250"
                  >
                    Ver diseño <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href="/dev"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted border border-border px-5 py-2.5 hover:border-ink hover:text-ink transition-colors duration-250"
                  >
                    Ver proyectos
                  </a>
                </div>
              </div>

              {/* Decorativo */}
              <div className="hidden md:block select-none" aria-hidden="true">
                <span className="font-bold tracking-tighter leading-none text-[10rem] text-border">
                  01
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos recientes */}
        <section aria-labelledby="proyectos-heading" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
            <div className="flex items-baseline justify-between mb-8">
              <h2
                id="proyectos-heading"
                className="font-mono text-xs tracking-widest uppercase text-muted"
              >
                Proyectos recientes
              </h2>
              <a
                href="/diseno"
                className="text-xs text-muted hover:text-ink transition-colors duration-150"
              >
                Ver todos →
              </a>
            </div>
            <ul className="divide-y divide-border list-none m-0 p-0">
              {mockProjects.map((project, i) => (
                <li key={project.num}>
                  <a
                    href={project.href}
                    className="group flex items-center gap-6 py-5 hover:pl-1 transition-all duration-200"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="font-mono text-xs text-muted w-6 shrink-0">{project.num}</span>
                    <span className="flex-1 text-base font-medium text-ink tracking-tight">
                      {project.title}
                    </span>
                    <span className="hidden sm:block text-sm text-muted">{project.tipo}</span>
                    <span className="font-mono text-xs text-muted">{project.year}</span>
                    <span
                      className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-150"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sobre */}
        <section aria-labelledby="sobre-heading" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
              <div>
                <h2
                  id="sobre-heading"
                  className="font-mono text-xs tracking-widest uppercase text-muted"
                >
                  Sobre
                </h2>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-medium tracking-tight text-ink leading-snug mb-6 max-w-[42ch]">
                  Diseñador gráfico de formación, desarrollador de software por convicción.
                </p>
                <p className="text-base leading-relaxed text-muted max-w-[52ch]">
                  Aquí irá una descripción real sobre la trayectoria y enfoque de trabajo. Diseño
                  gráfico, identidad visual, desarrollo web y software — todo en un mismo espacio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between border-t border-border">
          <span className="font-mono text-xs text-muted">© 2026 kimografico</span>
          <nav aria-label="Footer">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {(
                [
                  { label: 'Diseño', href: '/diseno' },
                  { label: 'Dev', href: '/dev' },
                  { label: 'Contacto', href: '/contacto' },
                ] as const
              ).map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs text-muted hover:text-ink transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}
