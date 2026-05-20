import { useMemo } from 'react';
import UIButton from '../../../components/ui/UIButton';
import { ProjectCard, type BaseProject } from '../../../components/ui/ProjectCard';
import { APP_BASENAME } from '../../../data/config/app';
import illustrations from '../../../data/kimo/illustrations.json';
import { useBackendStatus } from '../../../contexts/BackendStatusContext';
import type { Illustration } from '../../../interfaces/illustration';
import { isKimoAuthenticated } from '../../../lib/kimoAuth';

const ILLUSTRATIONS_PATH = import.meta.env.VITE_ILLUSTRATIONS_PATH;

export default function IllustrationsPage() {
  const { alive } = useBackendStatus();
  // Adaptador: Illustration → BaseProject
  const data: BaseProject[] = useMemo(
    () =>
      (illustrations as Illustration[]).map((item) => ({
        id: item.id,
        title: item.nombre,
        date: item.fecha ?? '',
        cliente: item.cliente,
        descripcion: item.descripcion,
        imagenes: [
          { image: item.image, label: 'Principal' },
          ...(item.imagenesExtra?.map((img) => ({
            image: img.image,
            label: img.label,
          })) ?? []),
        ],
        thumb: `${ILLUSTRATIONS_PATH}/thumbs/${item.id}.jpg`,
      })),
    [],
  );

  return (
    <div className="flex flex-col gap-12">
      <section className="border-b border-border" data-id="illustrations-page">
        <div className="max-w-7xl mx-auto py-16 md:py-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-none text-ink mb-6">
                Ilustraciones
              </h1>
              <p className="text-base leading-relaxed text-muted max-w-[52ch]">
                Trabajos de ilustración y diseño visual. Identidades, carteles, portadas y
                exploración de conceptos visuales.
              </p>
            </div>
            {isKimoAuthenticated() && (
              <UIButton
                href={`${APP_BASENAME}/kimo/add-illustration`}
                dataId="illustrations-add-btn"
                addBtn
                arrow
                disabled={alive === false}
              >
                Añadir ilustración
              </UIButton>
            )}
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="illustrations-gallery-grid"
          >
            {data.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/kimo/ilustraciones/${project.id}`}
                dataId={`illustration-card-${project.id}`}
                widescreen={false}
                buildImagePath={(filename) => `${ILLUSTRATIONS_PATH}/${filename}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
