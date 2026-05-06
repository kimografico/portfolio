import type { ResumeBasicsArea } from '../../interfaces/resume';

interface BasicsAreaFieldsProps {
  area: 'design' | 'development';
  data: ResumeBasicsArea;
  onFieldChange: <K extends keyof ResumeBasicsArea>(key: K, value: ResumeBasicsArea[K]) => void;
}

export default function BasicsAreaFields({ area, data, onFieldChange }: BasicsAreaFieldsProps) {
  return (
    <div
      className="space-y-4 rounded-xl border border-border p-4 bg-bg"
      data-id={`basics-${area}-fields`}
    >
      <h4 className="text-lg font-semibold text-ink">
        {area === 'design' ? 'Diseño' : 'Desarrollo'}
      </h4>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Título</span>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Resumen</span>
        <textarea
          value={data.summary}
          onChange={(e) => onFieldChange('summary', e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          rows={4}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Información adicional</span>
        <textarea
          value={data.additionalInfo ?? ''}
          onChange={(e) => onFieldChange('additionalInfo', e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm"
          rows={5}
        />
      </label>
    </div>
  );
}
