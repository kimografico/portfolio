import '../../styles/resume.css';
import resume from '../../data/resume.json';
import { renderMultilineText } from '../../utils/renderMultilineText';

export default function ResumeDesignPage() {
  // Filtrar datos para diseño (category: design o common)
  const filter = (item) => {
    if (!item || item.hide) return false;
    if (Array.isArray(item.category))
      return item.category.includes('design') || item.category.includes('common');
    return item.category === 'design' || item.category === 'common';
  };

  // Ordenar experiencia solo por la primera fecha (start), de más reciente a más antigua
  const sortedExperience = [...resume.experience].filter(filter).sort((a, b) => {
    const parseYear = (val) => {
      if (!val) return 0;
      const year = parseInt(val.slice(0, 4), 10);
      return isNaN(year) ? 0 : year;
    };
    return parseYear(b.start) - parseYear(a.start);
  });

  // Ordenar formación por fecha descendente
  const sortedEducation = [...resume.education].filter(filter).sort((a, b) => {
    const parseYear = (val) => {
      if (!val) return 0;
      if (typeof val === 'string' && val.match(/actual/i)) return 9999;
      const year = parseInt(val.slice(0, 4), 10);
      return isNaN(year) ? 0 : year;
    };
    const endB = parseYear(b.end);
    const endA = parseYear(a.end);
    if (endB !== endA) return endB - endA;
    return parseYear(b.start) - parseYear(a.start);
  });

  // Ordenar cursos por año descendente
  const sortedCourses = [...resume.courses].filter(filter).sort((a, b) => {
    // Puede ser string o número
    const yearA = typeof a.year === 'string' ? parseInt(a.year, 10) : a.year;
    const yearB = typeof b.year === 'string' ? parseInt(b.year, 10) : b.year;
    return (yearB || 0) - (yearA || 0);
  });

  // Ordenar workshops por año descendente
  const sortedWorkshops = [...resume.workshops].filter(filter).sort((a, b) => {
    const yearA = typeof a.year === 'string' ? parseInt(a.year, 10) : a.year;
    const yearB = typeof b.year === 'string' ? parseInt(b.year, 10) : b.year;
    return (yearB || 0) - (yearA || 0);
  });

  return (
    <main data-id="resume-design-page" className="resume-main">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-1 text-left">{resume.basics.name}</h1>
        <h2 className="text-2xl font-semibold mb-2 text-left">{resume.basics.design.title}</h2>
        <div className="mb-2 text-left">{renderMultilineText(resume.basics.design.summary)}</div>
        <div className="text-sm text-muted text-left">
          <div>
            <a
              href={resume.basics.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-700"
            >
              {resume.basics.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
        <hr />
      </header>

      {/* Sección de columnas: habilidades, software, idiomas */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        aria-label="skills-software-languages"
      >
        <div>
          <h3 className="text-xl font-semibold mb-2">Habilidades</h3>
          <ul className="list-disc ml-6">
            {resume.skills.filter(filter).map((s, i) => (
              <li key={i}>{s.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Software</h3>
          <ul className="list-disc ml-6">
            {resume.software.filter(filter).map((s, i) => (
              <li key={i}>{s.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Idiomas</h3>
          <ul className="list-disc ml-6">
            {resume.languages.filter(filter).map((l, i) => (
              <li key={i}>
                <span className="font-semibold">{l.name}</span>{' '}
                <span className="text-xs text-muted">({l.level})</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <hr />

      {/* Secciones de experiencia, formación, cursos, workshops se mantienen igual */}
      <section aria-labelledby="experience-heading">
        <h3 id="experience-heading" className="text-xl font-semibold mt-6 mb-2">
          Experiencia
        </h3>
        <ul className="ml-0 spaced">
          {sortedExperience.map((exp, i) => (
            <li key={i} className="mb-4">
              <div className="font-semibold">
                <p>{exp.role}</p>
                <span className="text-muted">{exp.company} </span>
                <span className="text-xs text-muted">
                  ({exp.start} - {exp.end})
                </span>
              </div>
              <div className="text-sm">{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="education-heading">
        <h3 id="education-heading" className="text-xl font-semibold mt-6 mb-2">
          Formación
        </h3>
        <ul className="ml-0 spaced">
          {sortedEducation.map((ed, i) => (
            <li key={i} className="mb-2">
              <div className="font-semibold">
                <p>{ed.degree}</p>
                <span className="text-muted">{ed.institution} </span>
                <span className="text-xs text-muted">
                  ({ed.start} - {ed.end})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="courses-heading">
        <h3 id="courses-heading" className="text-xl font-semibold mt-6 mb-2">
          Cursos
        </h3>
        <ul className="ml-0">
          {sortedCourses.map((c, i) => (
            <li key={i} className="mb-2">
              <div className="font-semibold">
                <p>{c.name}</p>
                <span className="text-muted">{c.institution} </span>
                <span className="text-xs text-muted">({c.year})</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {sortedWorkshops.length > 0 && (
        <section aria-labelledby="workshops-heading">
          <h3 id="workshops-heading" className="text-xl font-semibold mt-6 mb-2">
            Workshops
          </h3>
          <ul className="ml-0">
            {sortedWorkshops.map((w, i) => (
              <li key={i} className="mb-2">
                <div className="font-semibold">
                  {w.name} <span className="text-xs text-muted">({w.year})</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr />

      {/* Información adicional (técnica, especialización, etc) */}
      {resume.basics.design.additionalInfo && (
        <section aria-labelledby="additional-info-heading">
          <h3 id="additional-info-heading" className="text-xl font-semibold mt-6 mb-2">
            Información adicional
          </h3>
          <div className="text-sm text-muted leading-relaxed max-w-3xl">
            {renderMultilineText(resume.basics.design.additionalInfo)}
          </div>
        </section>
      )}
    </main>
  );
}
