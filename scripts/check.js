import { spawnSync } from 'node:child_process';

function run(cmd, args, label) {
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📋 ${label}\n`);

  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32', // clave para Windows
  });

  if (result.status !== 0) {
    console.log(`\n ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ Falló: ${label} ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌`);
    process.exit(result.status);
  }

  console.log(`👍 ${label} OK\n`);
}

console.log('\n🔍 Running pre-push checks...');

run('pnpm', ['lint'], 'Linting');
run('pnpm', ['typecheck'], 'Type checking');
run('pnpm', ['test', '--run'], 'Tests');
run('pnpm', ['build'], 'Build');

console.log(`
---------------------------------------------------------------------------------------
✅ ✅ ✅ ✅ ✅ ✅ Todo OK 👍 lint, typecheck, test y build correctos ✅ ✅ ✅ ✅ ✅ ✅
---------------------------------------------------------------------------------------
`);
