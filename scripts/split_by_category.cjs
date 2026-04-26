// Script para separar el JSON WP_OLD_PORTFOLIO_CONTENT en uno por categoría en la carpeta DOCS/
// Uso: node scripts/split_by_category.cjs

const fs = require('fs');
const path = require('path');

const INPUT_PATH = path.resolve(__dirname, '../WP_OLD_PORTFOLIO_CONTENT.json');
const OUTPUT_DIR = path.resolve(__dirname, '../DOCS');

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
  // Agrupar por categoría principal (primer elemento del array category)
  const byCategory = {};
  data.forEach((entry) => {
    const cat =
      Array.isArray(entry.category) && entry.category.length > 0
        ? entry.category[0].toUpperCase()
        : 'OTROS';
    if (!byCategory[cat]) byCategory[cat] = [];
    // Copiar solo id, title, content
    const { id, title, content } = entry;
    byCategory[cat].push({ id, title, content });
  });
  // Guardar cada grupo en un archivo
  Object.entries(byCategory).forEach(([cat, arr]) => {
    const fileName = path.join(OUTPUT_DIR, `${cat}.json`);
    fs.writeFileSync(fileName, JSON.stringify(arr, null, 2), 'utf-8');
    console.log('Archivo generado:', fileName);
  });
}

main();
