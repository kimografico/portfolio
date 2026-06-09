import { Link } from 'react-router-dom';
import type { ComponentType } from 'react';

export type ContactCardIcon = ComponentType<{
  size: number;
  strokeWidth: number;
  className?: string;
}>;

export interface ContactCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: ContactCardIcon;
  external?: boolean;
}

export function ContactCard({
  title,
  description,
  href,
  actionLabel,
  icon: Icon,
  external,
  id,
}: ContactCardProps) {
  const cardContent = (
    <>
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-bg)] text-[color:var(--color-accent)] shadow-sm ring-1 ring-border transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md">
        <Icon size={28} strokeWidth={1.8} className="shrink-0" />
      </span>

      <div className="mt-6 flex-1">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      </div>

      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] transition-transform duration-200 group-hover:translate-x-1">
        {actionLabel}
        <span aria-hidden="true">→</span>
      </span>
    </>
  );

  const sharedClassName =
    'group flex h-full flex-col rounded-3xl border border-border bg-[color:var(--color-bg)] p-8 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-xl';

  if (external) {
    return (
      <a href={href} className={sharedClassName} data-id={id}>
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={href} className={sharedClassName} data-id={id}>
      {cardContent}
    </Link>
  );
}
