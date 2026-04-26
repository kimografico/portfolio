/**
 * parse_all.cjs
 * ==============
 * Procesa TODOS los archivos JSON en DOCS/:
 * Lee el campo `content` de cada entrada y extrae datos estructurados.
 *
 * La lógica de extracción es la misma que en parse_3d.cjs,
 * pero aplicada de forma genérica a todas las categorías.
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// UTILI DADES
// =============================================================================

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToText(html) {
  return stripHtml(decodeHtmlEntities(html)).replace(/\s+/g, ' ').trim();
}

function getFilename(url) {
  try {
    return path.basename(new URL(url).pathname);
  } catch {
    return path.basename(url.split('?')[0]);
  }
}

function normalizeImageUrl(url) {
  return url.replace('http://', 'https://').replace(/-\d+x\d+(\.\w+)$/, '$1');
}

function getLargestFromSrcset(srcset) {
  if (!srcset) return null;
  const entries = srcset.split(',').map(s => s.trim().split(' ')[0]);
  const original = entries.find(url => !/-\d+x\d+\.\w+$/.test(url));
  if (original) return original.replace('http://', 'https://');
  const last = entries[entries.length - 1];
  return last ? last.replace('http://', 'https://') : null;
}

function firstWords(text, n = 4) {
  return text.trim().split(/\s+/).slice(0, n).join(' ');
}

// =============================================================================
// EXTRACTORES
// =============================================================================

function extractImages(html) {
  const images = [];
  const processedUrls = new Set();

  const lightboxRegex = /<a\s+href="([^"]+)"\s+data-elementor-open-lightbox="yes"\s+data-elementor-lightbox-title="([^"]+)"[^>]*>[\s\S]*?<\/a>/g;
  let m;

  while ((m = lightboxRegex.exec(html)) !== null) {
    const url = m[1].replace('http://', 'https://');
    if (!processedUrls.has(url)) {
      processedUrls.add(url);
      images.push({ url });
    }
  }

  const imgRegex = /<img[^>]+src="([^"]+)"(?:[^>]*srcset="([^"]*)")?[^>]*\/?>/g;

  while ((m = imgRegex.exec(html)) !== null) {
    const rawSrc = m[1];
    const srcset = m[2] ? decodeHtmlEntities(m[2]) : '';
    const url = srcset ? getLargestFromSrcset(srcset) : normalizeImageUrl(rawSrc);
    if (!url) continue;

    const urlFilename = getFilename(url);
    const urlBase = urlFilename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    const alreadyInLightbox = [...processedUrls].some(lbUrl => {
      const lbFilename = getFilename(lbUrl);
      return lbFilename === urlBase || lbFilename === urlFilename;
    });

    if (!alreadyInLightbox && !processedUrls.has(url)) {
      processedUrls.add(url);
      images.push({ url });
    }
  }

  return images;
}

function extractTexts(html) {
  const texts = [];
  const widgetRegex = /data-widget_type="text-editor\.default"[\s\S]*?<div class="elementor-widget-container">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g;
  let m;

  while ((m = widgetRegex.exec(html)) !== null) {
    const text = htmlToText(m[1]);
    if (text) texts.push(text);
  }

  return texts;
}

function extractYoutubeUrls(html) {
  const urls = [];
  const videoRegex = /data-settings="([^"]*youtube_url[^"]*)"/g;
  let m;

  while ((m = videoRegex.exec(html)) !== null) {
    try {
      const rawJson = m[1].replace(/&quot;/g, '"').replace(/\\\//g, '/');
      const settings = JSON.parse(rawJson);
      if (settings.youtube_url) {
        urls.push(settings.youtube_url);
      }
    } catch {
      // Ignorar JSON malformado
    }
  }

  return urls;
}

function extractStrongTexts(html) {
  const texts = [];
  const regex = /<strong>([\s\S]*?)<\/strong>/gi;
  let m;

  while ((m = regex.exec(html)) !== null) {
    const text = htmlToText(m[1]);
    if (text && text.length > 2) texts.push(text);
  }

  return texts;
}

function extractH2Texts(html) {
  const texts = [];
  const regex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let m;

  while ((m = regex.exec(html)) !== null) {
    const text = htmlToText(m[1]);
    if (text && text.length > 2) texts.push(text);
  }

  return texts;
}

// =============================================================================
// HEURÍSTICA DE CLIENTE
// =============================================================================

function extractCliente(projectTitle, firstText, strongTexts, h2Texts) {
  const ignoreList = [
    'resultado final',
    '–', '—', '---',
  ];

  const isIgnored = (text) =>
    ignoreList.some(i => text.toLowerCase().includes(i)) ||
    text.replace(/[–—-\s]/g, '').length === 0;

  const isSameAsTitle = (text) =>
    text.toLowerCase().trim() === projectTitle.toLowerCase().trim();

  const validStrong = strongTexts.filter(
    s => !isIgnored(s) && !isSameAsTitle(s) && s.length > 2
  );
  if (validStrong.length > 0) return validStrong[0];

  const validH2 = h2Texts.filter(
    s => !isIgnored(s) && !isSameAsTitle(s) && s.length > 2
  );
  if (validH2.length > 0) return validH2[0];

  if (!firstText) return null;

  const patterns = [
    /de la marca de ([A-ZÁÉÍÓÚÑ][^a-z,.\n]+?)(?:\.|,|\n|[a-z]|$)/,
    /para la empresa ([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ0-9 -]+?)(?:\.|,|\n|$)/,
    /\bdel ([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ]+(?:\s+[A-Za-záéíóúñÁÉÍÓÚÑ]+){0,3})(?:\.|,|\n|$)/,
    /\bde la ([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ]+(?:\s+[A-Za-záéíóúñÁÉÍÓÚÑ]+){0,2})(?:\.|,|\n|$)/,
    /\bde ([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ]+(?:\s+[A-Za-záéíóúñÁÉÍÓÚÑ]+){0,3})(?:\.|,|\n|$)/,
  ];

  for (const pattern of patterns) {
    const match = firstText.match(pattern);
    if (match) {
      const candidate = firstWords(match[1].trim(), 4);
      if (!isIgnored(candidate) && !isSameAsTitle(candidate) && candidate.length > 2) {
        return candidate;
      }
    }
  }

  return null;
}

// =============================================================================
// PROCESO PRINCIPAL
// =============================================================================

const docsDir = path.resolve(__dirname, '../DOCS');
const sourceFile = path.resolve(__dirname, '../WP_OLD_PORTFOLIO_MIN.json');

// Leer el archivo fuente
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

// Obtener lista de archivos JSON en DOCS/
const jsonFiles = fs.readdirSync(docsDir)
  .filter(f => f.endsWith('.json'))
  .sort();

console.log(`\nProcesando ${jsonFiles.length} archivos de DOCS/...\n`);

let totalProcessed = 0;

// Procesar cada archivo
for (const filename of jsonFiles) {
  const categoryName = filename.replace(/\.json$/, '');
  const categoryPath = path.join(docsDir, filename);

  // Restaurar contenido original desde sourceData
  const items = sourceData.filter(e =>
    Array.isArray(e.category) &&
    e.category[0].toLowerCase() === categoryName.toLowerCase()
  );

  if (items.length === 0) {
    console.log(`⚠  ${categoryName}: no se encontraron items en la fuente`);
    continue;
  }

  // Procesar items
  const result = items.map(entry => {
    const { id, title, content } = entry;

    const images = extractImages(content);
    const texts = extractTexts(content);
    const youtubeUrls = extractYoutubeUrls(content);
    const strongTexts = extractStrongTexts(content);
    const h2Texts = extractH2Texts(content);

    const descripcion = texts.length > 0 ? texts[0] : null;
    const cliente = extractCliente(title, descripcion, strongTexts, h2Texts);
    const imagenesArray = images.map(img => img.url);
    const videos = youtubeUrls;
    const extras = texts.slice(1).filter(t => t.trim());

    return {
      id,
      title,
      cliente: cliente ?? null,
      descripcion,
      imagenes: imagenesArray,
      videos,
      extras,
    };
  });

  // Escribir resultado
  fs.writeFileSync(categoryPath, JSON.stringify(result, null, 2), 'utf-8');
  totalProcessed += result.length;

  // Resumen por categoría
  const imageCount = result.reduce((sum, p) => sum + p.imagenes.length, 0);
  const videoCount = result.reduce((sum, p) => sum + p.videos.length, 0);
  const extrasCount = result.reduce((sum, p) => sum + p.extras.length, 0);

  console.log(
    `✓ ${categoryName}.json: ${result.length} items | ${imageCount} imágenes | ${videoCount} videos | ${extrasCount} extras`
  );
}

console.log(`\n✓ ¡Listo! Se procesaron ${totalProcessed} proyectos en total.\n`);
