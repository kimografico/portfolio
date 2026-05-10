import { useState } from 'react';
import type { ComponentType } from 'react';

type ResumeRowBaseProps = {
  visible: boolean;
  onToggleVisible: (value: boolean) => void;
  design: boolean;
  onToggleDesign: () => void;
  development: boolean;
  onToggleDevelopment: () => void;
};

type ToggleStateArgs = Partial<Pick<ResumeRowBaseProps, 'visible' | 'design' | 'development'>>;

type ToggleGroupArgs = {
  Component: ComponentType<ToggleGroupBaseProps>;
} & ToggleGroupBaseProps;

type ToggleIconArgs = {
  Component: ComponentType<ToggleIconBaseProps>;
} & ToggleIconBaseProps;

type ToggleGroupBaseProps = ResumeRowBaseProps & {
  dataIdPrefix: string;
  ariaLabelVisibleOn?: string;
  ariaLabelVisibleOff?: string;
  ariaLabelDesignOn?: string;
  ariaLabelDesignOff?: string;
  ariaLabelDevOn?: string;
  ariaLabelDevOff?: string;
  size?: number;
};

type ToggleIconBaseProps = {
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
};

/**
 * ResumeRowPlayground: Wrapper para stories interactivos de filas de resume
 * Permite controlar toggles (visible, design, development) y pasar handlers reales.
 * Uso: render: ResumeRowPlayground(EducationRow, { visible: true, design: true, development: false })
 */
// Playground para filas resume (SkillRow, CourseRow, etc)
export function ResumeRowPlayground<P extends ResumeRowBaseProps>(
  Component: ComponentType<P>,
  initialArgs: ToggleStateArgs,
) {
  return function Wrapper(props: P) {
    const [visible, setVisible] = useState<boolean>(props.visible ?? initialArgs.visible ?? true);
    const [design, setDesign] = useState<boolean>(props.design ?? initialArgs.design ?? false);
    const [development, setDevelopment] = useState<boolean>(
      props.development ?? initialArgs.development ?? false,
    );

    return (
      <Component
        {...props}
        visible={visible}
        onToggleVisible={setVisible}
        design={design}
        onToggleDesign={() => setDesign((value: boolean) => !value)}
        development={development}
        onToggleDevelopment={() => setDevelopment((value: boolean) => !value)}
      />
    );
  };
}

// Playground para ToggleGroup
export function ToggleGroupPlayground(args: ToggleGroupArgs) {
  const [visible, setVisible] = useState<boolean>(args.visible ?? true);
  const [design, setDesign] = useState<boolean>(args.design ?? false);
  const [development, setDevelopment] = useState<boolean>(args.development ?? false);

  return (
    <args.Component
      {...args}
      visible={visible}
      onToggleVisible={setVisible}
      design={design}
      onToggleDesign={() => setDesign((value: boolean) => !value)}
      development={development}
      onToggleDevelopment={() => setDevelopment((value: boolean) => !value)}
    />
  );
}

// Playground para ToggleIcon
export function ToggleIconPlayground(args: ToggleIconArgs) {
  const [value, setValue] = useState<boolean>(args.value ?? false);
  return <args.Component {...args} value={value} onChange={setValue} />;
}
