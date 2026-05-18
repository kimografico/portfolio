import type { FC } from 'react';
import ToggleGroup from './ToggleGroup';
import IconClose from '../iconos/IconClose';
import '../../styles/resumeForm.css';

interface CourseRowProps {
  name: string;
  onNameChange: (value: string) => void;
  institution: string;
  onInstitutionChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
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

const CourseRow: FC<CourseRowProps> = ({
  name,
  onNameChange,
  institution,
  onInstitutionChange,
  year,
  onYearChange,
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
        <span className="font-medium">Curso</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-name-input`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Centro</span>
        <input
          type="text"
          value={institution}
          onChange={(e) => onInstitutionChange(e.target.value)}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-institution-input`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Año</span>
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-year-select`}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className="resume-row-toggles">
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

export default CourseRow;
