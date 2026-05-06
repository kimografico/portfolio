import type { FC } from 'react';
import ToggleGroup from './ToggleGroup';
import IconClose from '../iconos/IconClose';
import '../../styles/resumeForm.css';

interface SkillRowProps {
  name: string;
  onNameChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: (value: boolean) => void;
  design: boolean;
  onToggleDesign: () => void;
  development: boolean;
  onToggleDevelopment: () => void;
  onRemove: () => void;
  dataIdPrefix: string;
}

const SkillRow: FC<SkillRowProps> = ({
  name,
  onNameChange,
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
    <div className="resume-row-fields skills">
      <label className="flex flex-col gap-1 text-sm text-ink">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
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

export default SkillRow;
