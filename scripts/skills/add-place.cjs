const { checkBackend, loadAuth, parseJsonArg, postJSON } = require('./common.cjs');

async function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.error('{"error":"Uso: node add-place.cjs \'{\"city\":\"...\",\"place\":\"...\",\"country\":\"...\",\"date\":\"...\",\"people\":\"...\"}\''}\'');
    process.exit(1);
  }

  const alive = await checkBackend();
  if (!alive) {
    console.error('{"error":"Backend no disponible en localhost:3001. Ejecuta: pnpm backend"}');
    process.exit(1);
  }

  const auth = loadAuth();
  const input = parseJsonArg(arg, 'add-place.cjs');

  // Strip id — backend generates it automatically
  const { id, ...body } = input;

  const result = await postJSON('localhost', 3001, '/api/kimo/places', body, auth);
  console.log(JSON.stringify(result.data));
}

main();
