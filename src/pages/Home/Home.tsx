import '../../styles/buttonStyles.css';
import recentWorks from '../../data/recent-works.json';
import './home.css';

const mockProjects = recentWorks;

export default function Home() {
  return (
    <>
      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

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
                  <a href="/diseno" className="btn-outline">
                    Ver diseño <span aria-hidden="true">→</span>
                  </a>
                  <a href="/dev" className="btn-outline">
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
    </>
  );
}
