#!/usr/bin/env bash
set -e
echo -e "\n\033[1;0m------------------------------------------------------------------------\033[0m"
echo -e "🔍 Running pre-push checks..."
echo -e "\033[1;0m------------------------------------------------------------------------\033[0m"
echo -e "📋 Starting with linting...\n"
pnpm lint
echo -e "👍 Linting passed!\n"
echo -e "\033[1;94m------------------------------------------------------------------------\033[0m"
echo -e "📋 Starting with type checking...\n"
pnpm typecheck
echo -e "👍 Type checking passed!\n"
echo -e "\033[1;94m------------------------------------------------------------------------\033[0m"
echo -e "📋 Starting with tests...\n"
pnpm test --run
echo -e "👍 Tests passed!\n"
echo -e "\033[1;94m------------------------------------------------------------------------\033[0m"
echo -e "📋 Starting with build...\n"
pnpm build
echo -e "\n👍 Build passed!\n"
echo -e "\n\033[1;94m------------------------------------------------------------------------\033[0m"

if [ $? -eq 0 ]; then
  echo -e "\n\033[1;97m👍 ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ 👍\n\nTodo OK: lint, typecheck, test y build PASAN\033[0m\n"
else
  echo -e "\n\033[1;31m❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌\n\nAlgún paso ha fallado\033[0m\n"
  exit 1
fi

echo -e "\033[1;94m------------------------------------------------------------------------\033[0m"