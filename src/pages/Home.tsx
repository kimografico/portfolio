import { useEffect } from 'react';
import '../styles/components/buttonStyles.css';
import '../styles/home.css';
import recentWorks from '../data/recent-works.json';
import carouselData from '../data/carousel.json';
import { APP_BASENAME } from '../data/config/app';
import HeroSection from '../components/layout/HeroSection';
import RecentProjectsSection from '../components/layout/RecentProjectsSection';
import ProjectCarousel from '../components/compositions/ProjectCarousel';
import SobreSection from '../components/layout/SobreSection';
import MyClients from '../components/compositions/MyClients';
import type { Project } from '../interfaces/project';
import type { CarouselImage } from '../interfaces/carousel';

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
          description={[
            'Trabajo entre la estética y la funcionalidad para construir experiencias digitales. Este es mi espacio para mostrar proyectos, procesos y práctica cotidiana. ',
            'Me muevo entre el diseño gráfico y el desarrollo para construir trabajos sólidos y expresivos. Este espacio recoge proyectos, procesos y práctica continua. ',
            'Creo desde la unión entre imagen y tecnología. Un lugar para enseñar proyectos, explorar procesos y compartir trabajo en curso. ',
            'Diseño con mirada visual y mentalidad de código. Aquí se muestran proyectos, decisiones de proceso y el trabajo que hay detrás de cada pieza. ',
            'Combino diseño y desarrollo para dar forma a soluciones digitales con personalidad. Este sitio reúne proyectos, procesos y trabajo cotidiano. ',
            'Trabajo donde el diseño toma forma y el código lo hace funcionar. Aquí encontrarás proyectos, procesos y el día a día de mi trabajo. ',
          ]}
          ctas={[
            { label: 'Ver trabajos de diseño', href: `${APP_BASENAME}/graphic-design` },
            { label: 'Ver desarrollos web', href: `${APP_BASENAME}/dev` },
          ]}
          decorator="01"
          animated
        />

        <SobreSection
          label="Sobre mí"
          heading="Mi recorrido parte del diseño gráfico y continúa en el desarrollo de software."
          description="Hoy combino estrategia visual, desarrollo web e identidad de marca, todo en un mismo espacio. Aporto una visión que conecta identidad visual, web y tecnología en un mismo lenguaje."
        />
        <ProjectCarousel
          images={carouselData as CarouselImage[]}
          height={400}
          ariaLabel="Carrusel de proyectos destacados"
          dataId="home-project-carousel"
          fullWidth
        />
        <RecentProjectsSection projects={projectsWithBasename} />
        <MyClients opacity={0.25} />
      </section>
    </>
  );
}
