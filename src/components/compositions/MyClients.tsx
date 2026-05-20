import { useEffect, useMemo, useId, useState } from 'react';
import clientsData from '../../data/clients.json';
import { useTheme } from '../../hooks/useTheme';

// Ruta base donde viven los logos en public/
const CLIENTS_BASE = '/portfolio/images/clients';

// Dimensiones fijas de cada logo (coinciden con los archivos 150×75 de la carpeta clients)
const LOGO_W = 150;
const LOGO_H = 75;

// Margen derecho por logo (equivale a gap de 24 px entre tarjetas)
const LOGO_MARGIN = 32;

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface ClientEntry {
  name: string;
  /** 0 = nunca mostrar | 1 = normal (default) | 2-3 = mayor freq. en modo random */
  rate?: number;
}

export interface MyClientsProps {
  /**
   * Velocidad del carrusel en píxeles por segundo.
   * @default 30
   */
  speed?: number;
  /**
   * Si es true, mezcla aleatoriamente los logos ponderando por `rate`.
   * @default false
   */
  randomize?: boolean;
  /**
   * Si es true, invierte la dirección del carrusel (derecha → izquierda).
   * @default false
   */
  rewind?: boolean;
  /**
   * Lista de clientes. Si no se pasa, se usa `clients.json`.
   */
  clients?: ClientEntry[];
  /**
   * Opacidad global de los logos (0–1). Útil para efectos sutiles.
   * @default 1
   */
  opacity?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const transparentLogoCache = new Map<string, string>();
const transparentLogoPromiseCache = new Map<string, Promise<string>>();

function supportsCanvasTransparency(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('2d'));
}

function createTransparentLogo(src: string): Promise<string> {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(src);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        resolve(src);
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // Elimina el fondo blanco del JPG para que el logo tenga alpha real.
      // Mantiene los trazos oscuros y suaviza los píxeles cercanos al blanco.
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

        if (luminance > 244) {
          data[i + 3] = 0;
        } else if (luminance > 220) {
          data[i + 3] = Math.max(0, Math.round((255 - luminance) * 2.2));
        }
      }

      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => resolve(src);
    image.src = src;
  });
}

function useTransparentLogoSrc(src: string): string {
  const [processedSrc, setProcessedSrc] = useState(() => transparentLogoCache.get(src) ?? src);

  useEffect(() => {
    let active = true;

    if (!supportsCanvasTransparency()) {
      return () => {
        active = false;
      };
    }

    const cached = transparentLogoCache.get(src);
    if (cached) {
      // Evita setState síncrono dentro del effect: la actualización se difiere
      // a una microtarea y sólo sucede si el componente sigue montado.
      Promise.resolve().then(() => {
        if (active) {
          setProcessedSrc(cached);
        }
      });
      return () => {
        active = false;
      };
    }

    const cachedPromise = transparentLogoPromiseCache.get(src);
    const promise = cachedPromise ?? createTransparentLogo(src);

    if (!cachedPromise) {
      transparentLogoPromiseCache.set(src, promise);
    }

    promise.then((result) => {
      transparentLogoPromiseCache.delete(src);
      transparentLogoCache.set(src, result);

      if (active) {
        setProcessedSrc(result);
      }
    });

    return () => {
      active = false;
    };
  }, [src]);

  return processedSrc;
}

/**
 * Devuelve la lista de logos a mostrar:
 * - Filtra los que tienen rate=0 (nunca aparecen).
 * - En modo random: expande cada logo según su rate (3 = aparece 3 veces)
 *   y mezcla con Fisher-Yates.
 * - En modo normal: devuelve los logos en orden, una vez cada uno.
 */
function buildDisplayList(items: ClientEntry[], randomize: boolean): ClientEntry[] {
  // rate=0 → excluido siempre (sea random o no)
  const visible = items.filter((item) => (item.rate ?? 1) > 0);

  if (!randomize) return visible;

  // Weighted shuffle (Efraimidis-Spirakis):
  // Cada logo aparece exactamente UNA vez, pero los de mayor rate
  // tienden a aparecer antes. Se asigna key = random() ^ (1/rate):
  // mayor key → posición más alta en la lista final.
  return [...visible]
    .map((item) => ({ item, key: Math.random() ** (1 / (item.rate ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .map(({ item }) => item);
}

/**
 * Extrae el nombre legible de un archivo: "La-Salle.jpg" → "La Salle"
 */
function toAlt(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
}

interface ClientLogoProps {
  src: string;
  alt: string;
  isDark: boolean;
  opacity: number;
}

/**
 * Renderiza un logo individual con transparencia real.
 *
 * El hook `useTransparentLogoSrc` elimina el fondo blanco del JPEG en canvas,
 * generando un PNG con alpha. Esto es suficiente para la transparencia visual;
 * los mix-blend-mode no son necesarios una vez que el fondo ya es transparente.
 *
 * En dark mode se aplica `filter: invert(1)` para que los trazos oscuros del
 * logo sean visibles sobre un fondo negro.
 */
function ClientLogo({ src, alt, isDark, opacity }: ClientLogoProps) {
  const transparentSrc = useTransparentLogoSrc(src);

  return (
    <img
      src={transparentSrc}
      alt={alt}
      width={LOGO_W}
      height={LOGO_H}
      loading="lazy"
      draggable={false}
      className="object-contain w-full h-full select-none"
      style={{
        filter: isDark ? 'invert(1)' : 'none',
        opacity,
      }}
    />
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * MyClients — carrusel horizontal infinito de logos de clientes.
 *
 * Técnica de loop:
 *   Se duplica la lista de logos ([...items, ...items]).
 *   El track tiene ancho = 2 × (N logos × tamaño).
 *   La animación desplaza translateX de 0 a -(la mitad del track).
 *   Cuando llega al -50%, visualmente es idéntico al inicio → loop perfecto.
 *
 * Lazy-loading:
 *   loading="lazy" en todos los <img>. El navegador carga cada imagen
 *   sólo cuando se acerca al viewport. Los logos de la segunda copia
 *   (buffer) se cargan bajo demanda mientras el carrusel avanza.
 *
 * Hover-pause:
 *   animationPlayState: paused | running según el estado local `paused`.
 *
 * Tema (light/dark):
 *   - Light → mix-blend-mode: multiply   (los blancos del logo son transparentes)
 *   - Dark  → mix-blend-mode: screen + invert  (invierte la imagen y aplica screen
 *             para que los negros del logo original sean transparentes sobre fondo oscuro)
 */
export default function MyClients({
  speed = 30,
  randomize = false,
  rewind = false,
  clients,
  opacity = 1,
}: MyClientsProps) {
  // Si no se pasan clientes por prop, se usa el JSON importado
  const source = clients ?? (clientsData as ClientEntry[]);
  const [theme] = useTheme();

  // La lista de logos a renderizar (con filtrado + optional shuffle ponderado)
  const items = useMemo(() => buildDisplayList(source, randomize), [source, randomize]);

  // Estado para pausar al hover
  const [paused, setPaused] = useState(false);

  // useId garantiza un nombre de animación único incluso con múltiples instancias
  // en la misma página. Limpiamos los ':' que genera React (son inválidos en CSS)
  const uid = useId().replace(/:/g, '-');
  const animName = `mc-scroll${uid}`;

  // Ancho de UNA copia completa de la tira (la mitad del track total).
  // Con LOGO_MARGIN como espacio entre logos (aplicado como marginRight en cada item),
  // el último logo también tendrá ese margen, lo que crea la separación visual
  // correcta en el momento del loop.
  const singleWidth = items.length * (LOGO_W + LOGO_MARGIN);

  // Duración en segundos: a 30 px/s, 3000 px → 100 s
  const duration = Math.round(singleWidth / speed);

  // Duplicamos la lista para el loop sin salto visual
  const loopedItems = [...items, ...items];
  const isDark = theme === 'dark';

  return (
    <div
      data-id="my-clients"
      className="overflow-hidden w-full py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        Keyframes inline con nombre único.
        Se usa una cifra de píxeles exacta (singleWidth) en vez de % porque el track
        tiene display:flex y su ancho real lo determina el contenido más que el CSS width.
        translateX negativo mueve la tira hacia la izquierda (scroll natural de carrusel).
      */}
      <style>{`
        @keyframes ${animName} {
          from { transform: translateX(0); }
          to   { transform: translateX(-${singleWidth}px); }
        }
      `}</style>

      <div
        data-id="my-clients-track"
        className="flex"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          // rewind invierte la dirección: los logos van de izquierda a derecha
          animationDirection: rewind ? 'reverse' : 'normal',
        }}
      >
        {loopedItems.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            data-id={`client-logo-${index}`}
            style={{
              width: LOGO_W,
              height: LOGO_H,
              marginRight: LOGO_MARGIN,
              flexShrink: 0,
            }}
            className="flex items-center justify-center"
          >
            <ClientLogo
              src={`${CLIENTS_BASE}/${client.name}`}
              alt={toAlt(client.name)}
              isDark={isDark}
              opacity={opacity}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
