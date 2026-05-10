import { useState } from 'react';

/**
 * ResumeRowPlayground: Wrapper para stories interactivos de filas de resume
 * Permite controlar toggles (visible, design, development) y pasar handlers reales.
 * Uso: render: ResumeRowPlayground(EducationRow, { visible: true, design: true, development: false })
 */
// Playground para filas resume (SkillRow, CourseRow, etc)
export function ResumeRowPlayground(Component, initialArgs) {
  return function Wrapper(props) {
    const [visible, setVisible] = useState(props.visible ?? initialArgs.visible ?? true);
    const [design, setDesign] = useState(props.design ?? initialArgs.design ?? false);
    const [development, setDevelopment] = useState(
      props.development ?? initialArgs.development ?? false,
    );
    return (
      <Component
        {...props}
        visible={visible}
        onToggleVisible={setVisible}
        design={design}
        onToggleDesign={() => setDesign((v) => !v)}
        development={development}
        onToggleDevelopment={() => setDevelopment((v) => !v)}
      />
    );
  };
}

// Playground para ToggleGroup
export function ToggleGroupPlayground(args) {
  const [visible, setVisible] = useState(args.visible ?? true);
  const [design, setDesign] = useState(args.design ?? false);
  const [development, setDevelopment] = useState(args.development ?? false);
  return (
    <args.Component
      {...args}
      visible={visible}
      onToggleVisible={setVisible}
      design={design}
      onToggleDesign={() => setDesign((v) => !v)}
      development={development}
      onToggleDevelopment={() => setDevelopment((v) => !v)}
    />
  );
}

// Playground para ToggleIcon
export function ToggleIconPlayground(args) {
  const [value, setValue] = useState(args.value ?? false);
  return <args.Component {...args} value={value} onChange={setValue} />;
}
