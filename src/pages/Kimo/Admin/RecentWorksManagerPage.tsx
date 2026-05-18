/**
 * RecentWorksManagerPage
 *
 * Página para administrar los trabajos recientes que aparecen en la landing.
 * Permite seleccionar qué proyectos aparecen como "Developer" y "GraphicDesign".
 */

import { useEffect, useState, useMemo } from 'react';
import UIButton from '../../../components/ui/UIButton';
import ProjectSelectorColumn from '../../../components/compositions/ProjectSelectorColumn';
import { getRecentWorks, updateRecentWorks, type RecentWork } from '../../../api/apiClient';

// Importar todos los JSONs de proyectos
import carteleria from '../../../data/graphic-design/carteleria.json';
import editorial from '../../../data/graphic-design/editorial.json';
import etiquetas from '../../../data/graphic-design/etiquetas.json';
import logotipos from '../../../data/graphic-design/logotipos.json';
import multimedia from '../../../data/graphic-design/multimedia.json';
import packaging from '../../../data/graphic-design/packaging.json';
import papeleria from '../../../data/graphic-design/papeleria.json';
import proyectosEspeciales from '../../../data/graphic-design/proyectos-especiales.json';
import frameworks from '../../../data/development/frameworks.json';
import vanilla from '../../../data/development/vanilla.json';
import wordpress from '../../../data/development/wordpress.json';

// Interfaz para proyectos del JSON
interface ProjectJSON {
  id: number | string;
  date: string;
  title: string;
  cliente: string;
  [key: string]: unknown;
}

// Normalizar los datos de proyectos con cast explícito para evitar errores de tipo
/* eslint-disable @typescript-eslint/no-explicit-any */
const gdProjects: (ProjectJSON & { type: string; category: string })[] = [
  ...(carteleria as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'carteleria' })),
  ...(editorial as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'editorial' })),
  ...(etiquetas as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'etiquetas' })),
  ...(logotipos as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'logotipos' })),
  ...(multimedia as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'multimedia' })),
  ...(packaging as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'packaging' })),
  ...(papeleria as any[]).map((p: any) => ({ ...p, type: 'gd', category: 'papeleria' })),
  ...(proyectosEspeciales as any[]).map((p: any) => ({
    ...p,
    type: 'gd',
    category: 'proyectos-especiales',
  })),
];

const devProjects: (ProjectJSON & { type: string; category: string })[] = [
  ...(frameworks as any[]).map((p: any) => ({ ...p, type: 'dev', category: 'frameworks' })),
  ...(vanilla as any[]).map((p: any) => ({ ...p, type: 'dev', category: 'vanilla' })),
  ...(wordpress as any[]).map((p: any) => ({ ...p, type: 'dev', category: 'wordpress' })),
];
/* eslint-enable @typescript-eslint/no-explicit-any */

interface SelectableProject extends ProjectJSON {
  type: string;
  category: string;
  isSelected: boolean;
}

export default function RecentWorksManagerPage() {
  const [selectedDev, setSelectedDev] = useState<Set<number | string>>(new Set());
  const [selectedGd, setSelectedGd] = useState<Set<number | string>>(new Set());
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar recent-works iniciales
  useEffect(() => {
    async function load() {
      try {
        setStatus('loading');
        const result = await getRecentWorks();
        const data = result.data as RecentWork[] | undefined;

        // Marcar los IDs seleccionados (extraer id del href)
        const devIds = new Set<number | string>();
        const gdIds = new Set<number | string>();

        for (const work of data || []) {
          if (work.category === 'Developer' && work.href.startsWith('/dev/')) {
            // Extraer el último segmento de la ruta, que puede ser `/dev/{category}/{id}`
            const parts = work.href.split('/').filter(Boolean);
            const last = parts[parts.length - 1] ?? '';
            devIds.add(isNaN(Number(last)) ? last : Number(last));
          } else if (
            work.category === 'GraphicDesign' &&
            work.href.startsWith('/graphic-design/')
          ) {
            const parts = work.href.split('/').filter(Boolean);
            const last = parts[parts.length - 1] ?? '';
            gdIds.add(isNaN(Number(last)) ? last : Number(last));
          }
        }

        setSelectedDev(devIds);
        setSelectedGd(gdIds);
        setStatus('idle');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : 'Error al cargar trabajos recientes');
      }
    }
    load();
  }, []);

  // Proyectos seleccionables con estado (sin ordenar, la ordenación la hace el componente)
  const selectableDevProjects = useMemo((): SelectableProject[] => {
    return devProjects.map((p) => ({ ...p, isSelected: selectedDev.has(p.id) }));
  }, [selectedDev]);

  const selectableGdProjects = useMemo((): SelectableProject[] => {
    return gdProjects.map((p) => ({ ...p, isSelected: selectedGd.has(p.id) }));
  }, [selectedGd]);

  // Toggle selección de proyecto Developer
  function toggleDevProject(id: number | string) {
    setSelectedDev((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Toggle selección de proyecto GraphicDesign
  function toggleGdProject(id: number | string) {
    setSelectedGd((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Guardar cambios
  async function handleSave() {
    try {
      setStatus('loading');
      setErrorMsg('');

      // Construir el nuevo array de recent-works
      let num = 1;
      const newData: RecentWork[] = [];

      // Añadir Developer
      for (const id of Array.from(selectedDev)) {
        const proj = devProjects.find((p) => p.id === id);
        if (proj) {
          newData.push({
            num: String(num).padStart(2, '0'),
            title: proj.title,
            tipo: proj.category.charAt(0).toUpperCase() + proj.category.slice(1),
            year: proj.date?.split('-')[0] || 'N/A',
            category: 'Developer',
            href: `/dev/${proj.category}/${proj.id}`, // Incluir la categoría en la ruta
          });
          num++;
        }
      }

      // Añadir GraphicDesign
      for (const id of Array.from(selectedGd)) {
        const proj = gdProjects.find((p) => p.id === id);
        if (proj) {
          newData.push({
            num: String(num).padStart(2, '0'),
            title: proj.title,
            tipo: proj.category.charAt(0).toUpperCase() + proj.category.slice(1),
            year: proj.date?.split('-')[0] || 'N/A',
            category: 'GraphicDesign',
            href: `/graphic-design/${proj.category}/${proj.id}`, // Incluir la categoría en la ruta
          });
          num++;
        }
      }

      await updateRecentWorks(newData);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar');
    }
  }

  return (
    <section data-id="recent-works-manager-page">
      <h2 className="text-xl font-semibold mb-6">Administrar trabajos recientes</h2>

      {/* Feedback de éxito */}
      {status === 'success' && (
        <div
          className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded"
          data-id="rw-success"
        >
          ✅ Trabajos recientes actualizados correctamente
        </div>
      )}

      {/* Feedback de error */}
      {status === 'error' && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded"
          data-id="rw-error"
        >
          ❌ {errorMsg}
        </div>
      )}

      {/* Contenedor de dos columnas con componentes reutilizables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <ProjectSelectorColumn
          title="Developer"
          color="blue"
          projects={selectableDevProjects}
          selectedCount={selectedDev.size}
          onToggle={toggleDevProject}
          dataId="rw-developer-section"
        />
        <ProjectSelectorColumn
          title="Diseño Gráfico"
          color="orange"
          projects={selectableGdProjects}
          selectedCount={selectedGd.size}
          onToggle={toggleGdProject}
          dataId="rw-graphicdesign-section"
        />
      </div>

      {/* Botón de guardar */}
      <div className="flex gap-4">
        <UIButton
          saveBtn
          onClick={handleSave}
          disabled={status === 'loading'}
          data-id="rw-save-btn"
        >
          {status === 'loading' ? 'Guardando…' : 'Guardar cambios en Recientes'}
        </UIButton>
        <div className="text-xs text-muted flex items-center">
          Total: {selectedDev.size + selectedGd.size} proyecto(s)
        </div>
      </div>
    </section>
  );
}
