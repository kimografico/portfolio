// Script para extraer los campos necesarios de un JSON exportado de WordPress
// Uso: node scripts/extract_projects.cjs

const fs = require('fs');
const path = require('path');

// Cambia la ruta si tu archivo de entrada tiene otro nombre o ubicación
const INPUT_PATH = path.resolve(__dirname, '../WP_OLD_PORTFOLIO.json');
const OUTPUT_PATH = path.resolve(__dirname, '../WP_OLD_PORTFOLIO_MIN.json');

function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error('No se encontró el archivo de entrada:', INPUT_PATH);
    process.exit(1);
  }
  const raw = fs.readFileSync(INPUT_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Error al parsear el JSON de entrada:', e);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error('El JSON de entrada debe ser un array de objetos.');
    process.exit(1);
  }
  // Campos a extraer
  const result = data.map((entry) => ({
    id: entry.id,
    date: entry.date,
    title: entry.title?.rendered || '',
    excerpt: entry.excerpt?.rendered || '',
    category: entry.class_list || '',
    content: entry.content?.rendered || '',
  }));
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log('Archivo resumido generado en:', OUTPUT_PATH);
}

main();
