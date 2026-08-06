#!/usr/bin/env bash
# Publica o site no GitHub Pages.
#
# Usa um worktree separado em vez de trocar de branch na pasta de trabalho.
# A versão anterior fazia `git checkout gh-pages` seguido de `find -exec rm`:
# quando o checkout falhava por causa de alterações não commitadas, o find
# rodava mesmo assim e apagava o src/ do main. Aconteceu em 05/08/2026 e só
# foi recuperado pelos source maps do .next. Aqui isso não é possível — o
# worktree é outra pasta, e nada toca a árvore do main.
set -euo pipefail

cd "$(dirname "$0")"

echo "==> exige árvore limpa"
if [ -n "$(git status --porcelain -- src public next.config.ts package.json)" ]; then
  echo "ERRO: há alterações não commitadas. Commite antes de publicar." >&2
  exit 1
fi

echo "==> build estático"
npm run build:pages
touch out/.nojekyll

WT="$(mktemp -d)"
trap 'git worktree remove --force "$WT" 2>/dev/null || true; rm -rf "$WT"' EXIT

echo "==> worktree de gh-pages"
git fetch -q origin gh-pages 2>/dev/null || true
if git show-ref -q --verify refs/remotes/origin/gh-pages; then
  git worktree add -q --force -B gh-pages "$WT" origin/gh-pages
else
  git worktree add -q --force --orphan -B gh-pages "$WT"
fi

echo "==> troca o conteúdo"
# -mindepth 1 e o filtro de .git garantem que só o conteúdo publicado sai
find "$WT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R out/. "$WT"/
printf 'node_modules/\n.next/\n' > "$WT"/.gitignore

git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "==> nada mudou"
  exit 0
fi
git -C "$WT" commit -q -m "Publica ${1:-atualização do site}

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git -C "$WT" push -q origin gh-pages
echo "==> publicado: https://ericcoutinho10-blip.github.io/cout-group-website/"
