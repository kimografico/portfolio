import { useRef } from 'react';

interface TechStackTagsProps {
  stack: string[];
  options: string[];
  onToggle: (tech: string) => void;
  onAddCustom: (tech: string) => void;
  dataIdBase?: string;
}

export default function TechStackTags({
  stack,
  options,
  onToggle,
  onAddCustom,
  dataIdBase = 'tech-stack',
}: TechStackTagsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-xs font-semibold text-muted mb-2">Stack tecnológico</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map((tech) => (
          <button
            type="button"
            key={tech}
            onClick={() => onToggle(tech)}
            data-id={`${dataIdBase}-option-${tech.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              stack.includes(tech)
                ? 'bg-accent text-white border-accent'
                : 'border-gray-300 text-muted hover:border-gray-400'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          ref={inputRef}
          data-id={`${dataIdBase}-custom-input`}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Otra tecnología…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = inputRef.current?.value.trim();
              if (value) {
                onAddCustom(value);
                if (inputRef.current) inputRef.current.value = '';
              }
            }
          }}
        />
        <span className="text-xs text-muted self-center">↵ Enter para añadir</span>
      </div>
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {stack.map((t) => (
            <span
              key={t}
              className="text-xs bg-accent text-white px-2 py-0.5 rounded flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                onClick={() => onToggle(t)}
                className="leading-none"
                aria-label={`Eliminar ${t}`}
                data-id={`${dataIdBase}-remove-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
