import type { FC, ComponentType } from 'react';

interface ToggleIconProps {
  value: boolean;
  onChange: (value: boolean) => void;
  icon: ComponentType<{ size?: number; color?: string; className?: string }>;
  iconOff?: ComponentType<{ size?: number; color?: string; className?: string }>;
  colorOn?: string;
  colorOff?: string;
  size?: number;
  dataId?: string;
  ariaLabelOn?: string;
  ariaLabelOff?: string;
}

/**
 * ToggleIcon: botón genérico de toggle con iconos customizables
 * - value: true = ON, false = OFF
 * - icon: icono para ON
 * - iconOff: icono para OFF (opcional, si no se pasa se usa icon)
 * - colorOn/colorOff: colores para cada estado
 * - ariaLabelOn/ariaLabelOff: accesibilidad
 */
const ToggleIcon: FC<ToggleIconProps> = ({
  value,
  onChange,
  icon: IconOn,
  iconOff: IconOff,
  colorOn = 'var(--color-dev)',
  colorOff = 'var(--color-off)',
  size = 28,
  dataId,
  ariaLabelOn = 'Activar',
  ariaLabelOff = 'Desactivar',
}) => {
  const isOn = value;
  const Icon = isOn ? IconOn : IconOff || IconOn;
  const color = isOn ? colorOn : colorOff;
  const ariaLabel = isOn ? ariaLabelOn : ariaLabelOff;
  return (
    <button
      type="button"
      aria-pressed={isOn}
      aria-label={ariaLabel}
      onClick={() => onChange(!value)}
      className={`p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors ${isOn ? 'hover:bg-accent/10' : 'hover:bg-muted/10'}`}
      data-id={dataId}
    >
      <Icon size={size} color={color} />
    </button>
  );
};

export default ToggleIcon;
