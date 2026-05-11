import type { FC } from 'react';
import ToggleGroup from './ToggleGroup';
import IconClose from '../iconos/IconClose';
import '../../styles/resumeForm.css';

interface EducationRowProps {
  degree: string;
  onDegreeChange: (value: string) => void;
  institution: string;
  onInstitutionChange: (value: string) => void;
  start: string;
  onStartChange: (value: string) => void;
  end: string;
  onEndChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: (value: boolean) => void;
  design: boolean;
  onToggleDesign: () => void;
  development: boolean;
  onToggleDevelopment: () => void;
  onRemove: () => void;
  dataIdPrefix: string;
  yearOptions: string[];
}

const EducationRow: FC<EducationRowProps> = ({
  degree,
  onDegreeChange,
  institution,
  onInstitutionChange,
  start,
  onStartChange,
  end,
  onEndChange,
  visible,
  onToggleVisible,
  design,
  onToggleDesign,
  development,
  onToggleDevelopment,
  onRemove,
  dataIdPrefix,
  yearOptions,
}) => (
  <div className="resume-row" data-id={`${dataIdPrefix}-row`}>
    <button
      type="button"
      className="remove-btn"
      aria-label="Eliminar"
      data-id={`${dataIdPrefix}-remove-btn`}
      onClick={onRemove}
    >
      <IconClose size={20} color="#e11d48" />
    </button>
    <div className="resume-row-fields">
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Titulación</span>
        <input
          type="text"
          value={degree}
          onChange={(e) => onDegreeChange(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-degree-input`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Centro</span>
        <input
          type="text"
          value={institution}
          onChange={(e) => onInstitutionChange(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-institution-input`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Inicio</span>
        <select
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-start-select`}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Fin</span>
        <select
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-end-select`}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className="resume-row-toggles md:col-span-2">
        <ToggleGroup
          visible={visible}
          onToggleVisible={onToggleVisible}
          design={design}
          onToggleDesign={onToggleDesign}
          development={development}
          onToggleDevelopment={onToggleDevelopment}
          dataIdPrefix={dataIdPrefix}
        />
      </div>
    </div>
  </div>
);

export default EducationRow;
