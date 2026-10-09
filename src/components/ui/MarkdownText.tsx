import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import type { Components, UrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface MarkdownTextProps {
  /** Texto en formato Markdown a renderizar */
  text?: string;
}

/** Comprueba si una URL usa el protocolo http o https */
const isHttpUrl = (url: string) => /^https?:\/\//i.test(url);

/**
 * Solo permite enlaces http/https; el resto de atributos usa el saneado por defecto.
 * Los enlaces con protocolos inseguros (p. ej. javascript:) se neutralizan.
 */
const urlTransform: UrlTransform = (url, key) => {
  if (key === 'href' && !isHttpUrl(url)) return '';
  return defaultUrlTransform(url);
};

/** Mapeo de elementos Markdown a las clases del sistema de diseño (Swiss minimalism) */
const components: Components = {
  a: ({ node: _node, href, children, ...props }) => (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  ),
  p: ({ node: _node, children, ...props }) => (
    <p {...props} className="mb-3 last:mb-0">
      {children}
    </p>
  ),
  h1: ({ node: _node, children, ...props }) => (
    <h1 {...props} className="mt-6 mb-3 text-2xl font-bold leading-tight text-ink first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <h2 {...props} className="mt-6 mb-3 text-xl font-bold leading-tight text-ink first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <h3 {...props} className="mt-5 mb-2 text-lg font-semibold leading-tight text-ink first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ node: _node, children, ...props }) => (
    <h4 {...props} className="mt-4 mb-2 text-base font-semibold text-ink first:mt-0">
      {children}
    </h4>
  ),
  ul: ({ node: _node, children, ...props }) => (
    <ul {...props} className="mb-3 list-disc space-y-1 pl-5">
      {children}
    </ul>
  ),
  ol: ({ node: _node, children, ...props }) => (
    <ol {...props} className="mb-3 list-decimal space-y-1 pl-5">
      {children}
    </ol>
  ),
  strong: ({ node: _node, children, ...props }) => (
    <strong {...props} className="font-semibold text-ink">
      {children}
    </strong>
  ),
  em: ({ node: _node, children, ...props }) => (
    <em {...props} className="italic">
      {children}
    </em>
  ),
  code: ({ node: _node, className, children, ...props }) => {
    const isBlock = typeof className === 'string' && className.startsWith('language-');

    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        className="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[0.85em] text-ink"
      >
        {children}
      </code>
    );
  },
  pre: ({ node: _node, children, ...props }) => (
    <pre
      {...props}
      className="mb-3 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-sm"
    >
      {children}
    </pre>
  ),
  blockquote: ({ node: _node, children, ...props }) => (
    <blockquote {...props} className="mb-3 border-l-2 border-border pl-4 italic">
      {children}
    </blockquote>
  ),
  hr: ({ node: _node, ...props }) => <hr {...props} className="my-6 border-border" />,
};

/**
 * MarkdownText
 * Renderiza un string en formato Markdown (GFM) como JSX estilizado con el sistema de diseño.
 * Los saltos de línea simples (\n) se tratan como <br/> gracias a remark-breaks.
 * Solo se permiten enlaces http/https, que se abren en una pestaña nueva.
 *
 * @param text - Texto en Markdown
 */
export function MarkdownText({ text }: MarkdownTextProps) {
  if (!text) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      urlTransform={urlTransform}
      components={components}
    >
      {text}
    </ReactMarkdown>
  );
}
