import type { FC } from 'react';
import ToggleGroup from './ToggleGroup';
import IconClose from '../iconos/IconClose';
import '../../styles/resumeForm.css';

interface LanguageRowProps {
  name: string;
  onNameChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: (value: boolean) => void;
  design: boolean;
  onToggleDesign: () => void;
  development: boolean;
  onToggleDevelopment: () => void;
  onRemove: () => void;
  dataIdPrefix: string;
}

const LanguageRow: FC<LanguageRowProps> = ({
  name,
  onNameChange,
  level,
  onLevelChange,
  visible,
  onToggleVisible,
  design,
  onToggleDesign,
  development,
  onToggleDevelopment,
  onRemove,
  dataIdPrefix,
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
        <span className="font-medium">Idioma</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-name-input`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Nivel</span>
        <input
          type="text"
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
          data-id={`${dataIdPrefix}-level-input`}
        />
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

export default LanguageRow;
