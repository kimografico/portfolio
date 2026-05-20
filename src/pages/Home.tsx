import { useEffect } from 'react';
import '../styles/components/buttonStyles.css';
import '../styles/home.css';
import recentWorks from '../data/recent-works.json';
import { APP_BASENAME } from '../data/config/app';
import HeroSection from '../components/layout/HeroSection';
import RecentProjectsSection from '../components/layout/RecentProjectsSection';
import SobreSection from '../components/layout/SobreSection';
import MyClients from '../components/compositions/MyClients';
import type { Project } from '../interfaces/project';

export default function Home() {
  // Señal UX interna: solo ayuda a decidir qué cabecera mostrar en páginas hijas.
  // No es una barrera de seguridad real.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('isInternal', 'true');
    }
  }, []);

  // Procesar hrefs de recentWorks para agregar APP_BASENAME
  const projectsWithBasename = (recentWorks as Project[]).map((project) => ({
    ...project,
    href: `${APP_BASENAME}${project.href}`,
  }));

  return (
    <>
      <section data-id="home-page">
        <HeroSection
          title={
            <>
              Diseñador gráfico
              <br />
              {'&'} desarrollador
              <br />
              de software.
            </>
          }
          description="Trabajo en la intersección entre diseño visual y código. Un espacio para mostrar proyectos, procesos y el trabajo del día a día."
          ctas={[
            { label: 'Ver trabajos de diseño', href: `${APP_BASENAME}/graphic-design` },
            { label: 'Ver desarrollos web', href: `${APP_BASENAME}/dev` },
          ]}
          decorator="01"
        />

        <RecentProjectsSection projects={projectsWithBasename} />
        <SobreSection
          label="Sobre"
          heading="Diseñador gráfico de formación, desarrollador de software por convicción."
          description="Aquí irá una descripción real sobre la trayectoria y enfoque de trabajo. Diseño gráfico, identidad visual, desarrollo web y software — todo en un mismo espacio."
        />
        <MyClients opacity={0.25} />
      </section>
    </>
  );
}
