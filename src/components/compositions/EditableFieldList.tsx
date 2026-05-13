import type { ChangeEvent } from 'react';

export interface EditableFieldListValue {
  value: string;
  label?: string;
}

interface EditableFieldListProps {
  label: string;
  values: string[] | EditableFieldListValue[];
  inputType?: 'text' | 'url';
  placeholder?: string;
  dataIdBase: string;
  onChange: (index: number, value: string, label?: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  addBtnLabel?: string;
  withLabel?: boolean;
  labelPlaceholder?: string;
}

export default function EditableFieldList({
  label,
  values,
  inputType = 'text',
  placeholder = '',
  dataIdBase,
  onChange,
  onAdd,
  onRemove,
  addBtnLabel = '+ Añadir',
  withLabel = false,
  labelPlaceholder = 'Descripción',
}: EditableFieldListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-accent hover:underline"
          data-id={`${dataIdBase}-add-btn`}
        >
          {addBtnLabel}
        </button>
      </div>
      <div className="space-y-2">
        {(values as (string | EditableFieldListValue)[]).map((val, i) => {
          const value = typeof val === 'string' ? val : val.value;
          const labelVal = typeof val === 'string' ? '' : (val.label ?? '');
          return (
            <div key={i} className="flex gap-2">
              <input
                type={inputType}
                data-id={`${dataIdBase}-${i}`}
                className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                placeholder={placeholder}
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  withLabel ? onChange(i, e.target.value, labelVal) : onChange(i, e.target.value)
                }
              />
              {withLabel && (
                <input
                  type="text"
                  data-id={`${dataIdBase}-label-${i}`}
                  className="w-64 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                  placeholder={labelPlaceholder}
                  value={labelVal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange(i, value, e.target.value)
                  }
                />
              )}
              {values.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  data-id={`${dataIdBase}-remove-btn-${i}`}
                  className="text-muted hover:text-red-500 transition-colors text-lg leading-none pb-0.5"
                  aria-label="Eliminar"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
