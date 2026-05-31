import type { FormEvent } from 'react';
import UIButton from '../ui/UIButton';
import { APP_BASENAME } from '../../data/config/app';
import { IconFingerprint } from '../iconos';

interface KimoLoginProps {
  password: string;
  notice?: string;
  error: string;
  isSubmitting: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function KimoLogin({
  password,
  notice,
  error,
  isSubmitting,
  onPasswordChange,
  onSubmit,
}: KimoLoginProps) {
  return (
    <section
      className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_80px_-36px_rgba(0,0,0,0.45)]"
      data-id="kimo-login-card"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-cta to-accent" />

      <div className="p-6 md:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <IconFingerprint size={30} strokeWidth={1.5} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Área privada
            </p>
            <h1 className="mt-1 text-3xl font-bold text-ink md:text-4xl">Acceso a Kimo</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted md:text-base">
              Introduce la contraseña para entrar en el espacio personal y en las páginas de
              administración.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} data-id="kimo-login-form">
          <label className="block" htmlFor="kimo-login-password">
            <span className="mb-2 block text-sm font-medium text-ink">Contraseña</span>
            <input
              id="kimo-login-password"
              data-id="kimo-login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Escribe la contraseña"
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          {notice ? (
            <div
              className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-ink"
              aria-live="polite"
              data-id="kimo-login-notice"
            >
              {notice}
            </div>
          ) : null}

          {error ? (
            <div
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-ink"
              role="alert"
              data-id="kimo-login-error"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <UIButton
              solid
              color="cta"
              type="submit"
              disabled={isSubmitting}
              dataId="kimo-login-submit"
            >
              {isSubmitting ? 'Comprobando…' : 'Entrar'}
            </UIButton>

            <UIButton href={`${APP_BASENAME}/`} link dataId="kimo-login-home-link">
              Volver al inicio
            </UIButton>
          </div>
        </form>
      </div>
    </section>
  );
}
