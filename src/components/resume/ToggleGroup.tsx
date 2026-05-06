import type { FC } from 'react';
import ToggleIcon from './ToggleIcon';
import { IconVisible, IconHidden, IconPen, IconCode } from '../iconos';

interface ToggleGroupProps {
  visible: boolean;
  onToggleVisible: (value: boolean) => void;
  design: boolean;
  onToggleDesign: () => void;
  development: boolean;
  onToggleDevelopment: () => void;
  dataIdPrefix: string;
  ariaLabelVisibleOn?: string;
  ariaLabelVisibleOff?: string;
  ariaLabelDesignOn?: string;
  ariaLabelDesignOff?: string;
  ariaLabelDevOn?: string;
  ariaLabelDevOff?: string;
  size?: number;
}

const ToggleGroup: FC<ToggleGroupProps> = ({
  visible,
  onToggleVisible,
  design,
  onToggleDesign,
  development,
  onToggleDevelopment,
  dataIdPrefix,
  ariaLabelVisibleOn = 'Ocultar',
  ariaLabelVisibleOff = 'Mostrar',
  ariaLabelDesignOn = 'Quitar de Diseño',
  ariaLabelDesignOff = 'Añadir a Diseño',
  ariaLabelDevOn = 'Quitar de Desarrollo',
  ariaLabelDevOff = 'Añadir a Desarrollo',
  size = 28,
}) => (
  <div className="flex flex-row items-center gap-6" data-id={`${dataIdPrefix}-toggle-group`}>
    <ToggleIcon
      value={visible}
      onChange={onToggleVisible}
      icon={IconVisible}
      iconOff={IconHidden}
      colorOn="var(--color-cta)"
      size={size}
      dataId={`${dataIdPrefix}-visibility-toggle`}
      ariaLabelOn={ariaLabelVisibleOn}
      ariaLabelOff={ariaLabelVisibleOff}
    />
    <ToggleIcon
      value={design}
      onChange={onToggleDesign}
      icon={IconPen}
      size={size}
      dataId={`${dataIdPrefix}-category-toggle-design`}
      ariaLabelOn={ariaLabelDesignOn}
      ariaLabelOff={ariaLabelDesignOff}
    />
    <ToggleIcon
      value={development}
      onChange={onToggleDevelopment}
      icon={IconCode}
      size={size}
      dataId={`${dataIdPrefix}-category-toggle-development`}
      ariaLabelOn={ariaLabelDevOn}
      ariaLabelOff={ariaLabelDevOff}
    />
  </div>
);

export default ToggleGroup;
