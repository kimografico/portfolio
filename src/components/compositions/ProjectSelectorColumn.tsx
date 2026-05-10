import React from 'react';

interface ProjectJSON {
  id: number | string;
  date: string;
  title: string;
  cliente: string;
  [key: string]: unknown;
}

interface SelectableProject extends ProjectJSON {
  type: string;
  category: string;
  isSelected: boolean;
}

interface ProjectSelectorColumnProps {
  title: string;
  color: string; // Ej: 'blue' o 'orange'
  projects: SelectableProject[];
  selectedCount: number;
  onToggle: (id: number | string) => void;
  dataId: string;
  IconFallback?: React.FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
}

const ProjectSelectorColumn: React.FC<ProjectSelectorColumnProps> = ({
  title,
  color,
  projects,
  selectedCount,
  onToggle,
  dataId,
}) => {
  // Determinar clases de color
  const titleClass =
    color === 'blue' ? 'text-blue-600' : color === 'orange' ? 'text-orange-600' : '';
  const accentClass =
    color === 'blue' ? 'accent-blue-600' : color === 'orange' ? 'accent-orange-600' : '';
  // Ordenar proyectos por fecha descendente (más nuevo primero)
  const sortedProjects = [...projects].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div data-id={dataId}>
      <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>{title}</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto border rounded p-4 bg-[var(--color-bg-modal)]">
        {sortedProjects.length === 0 ? (
          <p className="text-sm text-muted">No hay proyectos</p>
        ) : (
          sortedProjects.map((proj) => (
            <label
              key={proj.id}
              className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
              data-id={`rw-project-${proj.id}`}
            >
              <input
                type="checkbox"
                checked={proj.isSelected}
                onChange={() => onToggle(proj.id)}
                className={`w-4 h-4 ${accentClass}`}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{proj.title}</div>
                <div className="text-xs text-gray-500">
                  {proj.category} • {proj.date}
                </div>
              </div>
            </label>
          ))
        )}
      </div>
      <div className="mt-2 text-xs text-muted">{selectedCount} seleccionado(s)</div>
    </div>
  );
};

export default ProjectSelectorColumn;
