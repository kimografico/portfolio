import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ToggleIcon from '../../../src/components/resume/ToggleIcon';
import ToggleGroup from '../../../src/components/resume/ToggleGroup';
import BasicsAreaFields from '../../../src/components/resume/BasicsAreaFields';
import ExperienceRow from '../../../src/components/resume/ExperienceRow';
import SoftwareRow from '../../../src/components/resume/SoftwareRow';
import SkillRow from '../../../src/components/resume/SkillRow';

const DemoIcon = ({
  size = 24,
  color = 'currentColor',
}: {
  size?: number;
  color?: string;
  className?: string;
}) => <svg data-testid="toggle-icon" width={size} height={size} fill={color} />;

describe('resume editing components', () => {
  it('cambia el estado de ToggleIcon y ToggleGroup al hacer click', () => {
    // Estos toggles se usan para cambiar visibilidad y categorías sin recargar la página.
    const onToggle = vi.fn();

    render(<ToggleIcon value={true} onChange={onToggle} icon={DemoIcon} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(false);

    render(
      <ToggleGroup
        visible={true}
        onToggleVisible={vi.fn()}
        design={false}
        onToggleDesign={vi.fn()}
        development={true}
        onToggleDevelopment={vi.fn()}
        dataIdPrefix="resume-item"
      />,
    );

    expect(screen.getByRole('button', { name: /ocultar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir a diseño/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /quitar de desarrollo/i })).toBeInTheDocument();
  });

  it('permite editar los campos de básicos del resume', () => {
    // BasicsAreaFields concentra la edición del bloque principal del CV.
    const onFieldChange = vi.fn();

    render(
      <BasicsAreaFields
        area="design"
        data={{ title: 'Título', summary: 'Resumen', additionalInfo: 'Info' }}
        onFieldChange={onFieldChange}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('Título'), { target: { value: 'Título X' } });
    expect(onFieldChange).toHaveBeenCalledWith('title', 'Título X');
  });

  it('renderiza y conecta las filas de edición del resume', () => {
    // Las filas reutilizan el mismo patrón para inputs y toggles en distintas secciones.
    const onRemove = vi.fn();
    const sharedToggles = {
      visible: true,
      onToggleVisible: vi.fn(),
      design: true,
      onToggleDesign: vi.fn(),
      development: false,
      onToggleDevelopment: vi.fn(),
    };

    render(
      <>
        <ExperienceRow
          role="Dev"
          onRoleChange={vi.fn()}
          company="Studio"
          onCompanyChange={vi.fn()}
          start="2024"
          onStartChange={vi.fn()}
          end="HOY"
          onEndChange={vi.fn()}
          description="Trabajo"
          onDescriptionChange={vi.fn()}
          onRemove={onRemove}
          dataIdPrefix="experience"
          yearOptions={['2024', 'HOY']}
          {...sharedToggles}
        />
        <SoftwareRow
          name="Figma"
          onNameChange={vi.fn()}
          onRemove={vi.fn()}
          dataIdPrefix="software"
          {...sharedToggles}
        />
        <SkillRow
          name="CSS"
          onNameChange={vi.fn()}
          onRemove={vi.fn()}
          dataIdPrefix="skill"
          {...sharedToggles}
        />
      </>,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(screen.getByDisplayValue('Dev')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Figma')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CSS')).toBeInTheDocument();
  });
});
