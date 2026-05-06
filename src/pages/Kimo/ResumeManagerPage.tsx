import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getResume, updateResume } from '../../api/apiClient';
import CourseRow from '../../components/resume/CourseRow';
import EducationRow from '../../components/resume/EducationRow';
import ExperienceRow from '../../components/resume/ExperienceRow';
import LanguageRow from '../../components/resume/LanguageRow';
import SkillRow from '../../components/resume/SkillRow';
import SoftwareRow from '../../components/resume/SoftwareRow';
import WorkshopRow from '../../components/resume/WorkshopRow';
import type { ResumeData } from '../../interfaces/resume';
import {
  updateBasicsField,
  updateBasicsArea,
  updateSectionItem,
  addSectionItem,
  removeSectionItem,
  toggleCategory,
  toggleHide,
} from '../../utils/resumeStateHelpers';
import { normalizeCategory, normalizeResume } from '../../utils/resumeNormalization';
import {
  createEmptySkill,
  createEmptySoftware,
  createEmptyLanguage,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyCourse,
  createEmptyWorkshop,
} from '../../utils/resumeFactories';
import BasicsAreaFields from '../../components/resume/BasicsAreaFields';

function getYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1985 + 1 }, (_, index) =>
    String(currentYear - index),
  );
  return ['HOY', ...years];
}

function SectionCard({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      data-id={`${title.toLowerCase().replace(/\s+/g, '-')}-section`}
    >
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-ink">
      <span className="font-medium">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border px-3 py-2 text-sm"
      />
    </label>
  );
}

export default function ResumeManagerPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const yearOptions = useMemo(() => getYearOptions(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus('loading');
        const response = await getResume();
        if (cancelled) return;
        if (!response.data) throw new Error('No se ha recibido el curriculum');
        setResumeData(normalizeResume(response.data));
        setStatus('idle');
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error al cargar el curriculum');
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!resumeData) return;
    try {
      setStatus('saving');
      setMessage('');
      await updateResume(resumeData);
      setStatus('success');
      setMessage('Curriculum actualizado correctamente');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Error al guardar el curriculum');
    }
  }

  if (status === 'loading' && !resumeData) {
    return (
      <section data-id="resume-manager-page" className="space-y-4">
        <p className="py-16 text-center text-muted">Cargando curriculum…</p>
      </section>
    );
  }

  if (!resumeData) {
    return (
      <section data-id="resume-manager-page" className="space-y-4">
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
          {message || 'No se pudo cargar el curriculum'}
        </div>
      </section>
    );
  }

  const saveDisabled = status === 'saving';

  return (
    <section data-id="resume-manager-page" className="space-y-6 pb-16">
      <header className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Gestor de curriculum</h2>
          <p className="text-sm text-muted">
            Edita los bloques del curriculum y guarda los cambios directamente en resume.json.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled}
            className="rounded-md bg-cta px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'saving' ? 'Guardando…' : 'Guardar curriculum'}
          </button>
          <p className="text-xs text-muted">Formato: visible/oculto + categorías por entrada.</p>
        </div>
      </header>

      {status === 'success' && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-green-800">
          {message}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{message}</div>
      )}

      <SectionCard title="Basics" subtitle="Datos compartidos y bloques de Diseño / Desarrollo">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-id="basics-fields-grid">
          <TextField
            label="Nombre"
            value={resumeData.basics.name}
            onChange={(value) => updateBasicsField(setResumeData, 'name', value)}
          />
          <TextField
            label="Web"
            value={resumeData.basics.website}
            onChange={(value) => updateBasicsField(setResumeData, 'website', value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <BasicsAreaFields
            area="design"
            data={resumeData.basics.design}
            onFieldChange={(key, value) => updateBasicsArea(setResumeData, 'design', key, value)}
          />
          <BasicsAreaFields
            area="development"
            data={resumeData.basics.development}
            onFieldChange={(key, value) =>
              updateBasicsArea(setResumeData, 'development', key, value)
            }
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Habilidades"
        subtitle="Una entrada por habilidad"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'skills', createEmptySkill())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.skills.map((item, index) => (
            <SkillRow
              key={`${item.name || 'skill'}-${index}`}
              name={item.name}
              onNameChange={(value) =>
                updateSectionItem(setResumeData, 'skills', index, (current) => ({
                  ...current,
                  name: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'skills', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'skills', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'skills', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'skills', index)}
              dataIdPrefix={`skills-${index}`}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Software"
        subtitle="Herramientas y programas"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'software', createEmptySoftware())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.software.map((item, index) => (
            <SoftwareRow
              key={`${item.name || 'software'}-${index}`}
              name={item.name}
              onNameChange={(value) =>
                updateSectionItem(setResumeData, 'software', index, (current) => ({
                  ...current,
                  name: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'software', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'software', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'software', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'software', index)}
              dataIdPrefix={`software-${index}`}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Experiencia"
        subtitle="Ordenada después por fecha en las ResumePages"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'experience', createEmptyExperience())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.experience.map((item, index) => (
            <ExperienceRow
              key={`${item.role || 'experience'}-${index}`}
              role={item.role}
              onRoleChange={(value) =>
                updateSectionItem(setResumeData, 'experience', index, (current) => ({
                  ...current,
                  role: value,
                }))
              }
              company={item.company}
              onCompanyChange={(value) =>
                updateSectionItem(setResumeData, 'experience', index, (current) => ({
                  ...current,
                  company: value,
                }))
              }
              start={item.start}
              onStartChange={(value) =>
                updateSectionItem(setResumeData, 'experience', index, (current) => ({
                  ...current,
                  start: value,
                }))
              }
              end={item.end}
              onEndChange={(value) =>
                updateSectionItem(setResumeData, 'experience', index, (current) => ({
                  ...current,
                  end: value,
                }))
              }
              description={item.description}
              onDescriptionChange={(value) =>
                updateSectionItem(setResumeData, 'experience', index, (current) => ({
                  ...current,
                  description: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'experience', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'experience', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'experience', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'experience', index)}
              dataIdPrefix={`experience-${index}`}
              yearOptions={yearOptions}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Formación"
        subtitle="Títulos académicos y estudios"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'education', createEmptyEducation())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.education.map((item, index) => (
            <EducationRow
              key={`${item.degree || 'education'}-${index}`}
              degree={item.degree}
              onDegreeChange={(value) =>
                updateSectionItem(setResumeData, 'education', index, (current) => ({
                  ...current,
                  degree: value,
                }))
              }
              institution={item.institution}
              onInstitutionChange={(value) =>
                updateSectionItem(setResumeData, 'education', index, (current) => ({
                  ...current,
                  institution: value,
                }))
              }
              start={item.start}
              onStartChange={(value) =>
                updateSectionItem(setResumeData, 'education', index, (current) => ({
                  ...current,
                  start: value,
                }))
              }
              end={item.end}
              onEndChange={(value) =>
                updateSectionItem(setResumeData, 'education', index, (current) => ({
                  ...current,
                  end: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'education', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'education', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'education', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'education', index)}
              dataIdPrefix={`education-${index}`}
              yearOptions={yearOptions}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Cursos"
        subtitle="Cursos y formaciones complementarias"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'courses', createEmptyCourse())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.courses.map((item, index) => (
            <CourseRow
              key={`${item.name || 'course'}-${index}`}
              name={item.name}
              onNameChange={(value) =>
                updateSectionItem(setResumeData, 'courses', index, (current) => ({
                  ...current,
                  name: value,
                }))
              }
              institution={item.institution}
              onInstitutionChange={(value) =>
                updateSectionItem(setResumeData, 'courses', index, (current) => ({
                  ...current,
                  institution: value,
                }))
              }
              year={String(item.year)}
              onYearChange={(value) =>
                updateSectionItem(setResumeData, 'courses', index, (current) => ({
                  ...current,
                  year: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'courses', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'courses', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'courses', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'courses', index)}
              dataIdPrefix={`courses-${index}`}
              yearOptions={yearOptions}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Workshops"
        subtitle="Eventos, conferencias y talleres"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'workshops', createEmptyWorkshop())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.workshops.map((item, index) => (
            <WorkshopRow
              key={`${item.name || 'workshop'}-${index}`}
              name={item.name}
              onNameChange={(value) =>
                updateSectionItem(setResumeData, 'workshops', index, (current) => ({
                  ...current,
                  name: value,
                }))
              }
              year={String(item.year)}
              onYearChange={(value) =>
                updateSectionItem(setResumeData, 'workshops', index, (current) => ({
                  ...current,
                  year: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'workshops', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'workshops', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'workshops', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'workshops', index)}
              dataIdPrefix={`workshops-${index}`}
              yearOptions={yearOptions}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Idiomas"
        subtitle="Idiomas y nivel"
        actions={
          <button
            type="button"
            onClick={() => addSectionItem(setResumeData, 'languages', createEmptyLanguage())}
            className="self-start rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-bg"
          >
            + Añadir
          </button>
        }
      >
        <div className="space-y-4">
          {resumeData.languages.map((item, index) => (
            <LanguageRow
              key={`${item.name || 'language'}-${index}`}
              name={item.name}
              onNameChange={(value) =>
                updateSectionItem(setResumeData, 'languages', index, (current) => ({
                  ...current,
                  name: value,
                }))
              }
              level={item.level}
              onLevelChange={(value) =>
                updateSectionItem(setResumeData, 'languages', index, (current) => ({
                  ...current,
                  level: value,
                }))
              }
              visible={!(item.hide ?? false)}
              onToggleVisible={(value) => toggleHide(setResumeData, 'languages', index, !value)}
              design={normalizeCategory(item.category).includes('design')}
              onToggleDesign={() => toggleCategory(setResumeData, 'languages', index, 'design')}
              development={normalizeCategory(item.category).includes('development')}
              onToggleDevelopment={() =>
                toggleCategory(setResumeData, 'languages', index, 'development')
              }
              onRemove={() => removeSectionItem(setResumeData, 'languages', index)}
              dataIdPrefix={`languages-${index}`}
            />
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="text-xs text-muted">
          {resumeData.skills.length} habilidades · {resumeData.experience.length} experiencias ·{' '}
          {resumeData.education.length} formaciones
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveDisabled}
          className="rounded-md bg-cta px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'saving' ? 'Guardando…' : 'Guardar curriculum'}
        </button>
      </div>
    </section>
  );
}
