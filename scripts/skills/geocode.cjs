const { checkBackend, postJSON } = require('./common.cjs');

async function main() {
  const query = process.argv[2];
  const countryCode = process.argv[3] || '';

  if (!query) {
    console.error('{"error":"Uso: node geocode.cjs \\"nombre del lugar\\" [\\"código país\\"]"}');
    process.exit(1);
  }

  const alive = await checkBackend();
  if (!alive) {
    console.error('{"error":"Backend no disponible en localhost:3001. Ejecuta: pnpm backend"}');
    process.exit(1);
  }

  const body = countryCode ? { q: query, countrycode: countryCode } : { q: query };
  const result = await postJSON('localhost', 3001, '/api/geocode', body);
  console.log(JSON.stringify(result.data));
}

main();
