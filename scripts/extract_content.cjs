// Script para extraer solo id, title, category y content de WP_OLD_PORTFOLIO_MIN.json
// Uso: node scripts/extract_content.cjs

const fs = require('fs');
const path = require('path');

const INPUT_PATH = path.resolve(__dirname, '../WP_OLD_PORTFOLIO_MIN.json');
const OUTPUT_PATH = path.resolve(__dirname, '../WP_OLD_PORTFOLIO_CONTENT.json');

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
  // Extraer solo los campos requeridos
  const result = data.map((entry) => ({
    id: entry.id,
    title: entry.title,
    category: entry.category,
    content: entry.content,
  }));
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log('Archivo generado en:', OUTPUT_PATH);
}

main();
