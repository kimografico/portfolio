/**
 * Helper para renderizar textos con saltos de línea (\n) como <br /> en JSX.
 * Divide el texto por saltos de línea y retorna fragmentos JSX.
 *
 * @param text - El texto a renderizar, puede contener \n para saltos de línea
 * @returns Array de elementos JSX (strings y <br />)
 *
 * @example
 * {renderMultilineText("Línea 1\nLínea 2\nLínea 3")}
 * // Renderiza:
 * // Línea 1
 * // <br />
 * // Línea 2
 * // <br />
 * // Línea 3
 */
export function renderMultilineText(text?: string) {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, index) => (
    <span key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}
