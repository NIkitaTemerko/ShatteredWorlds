#!/usr/bin/env node

// Скрипт обновляет README.md: вставляет или обновляет блок манифеста и changelog вверху файла.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const pkgPath = resolve(process.cwd(), "package.json");
const readmePath = resolve(process.cwd(), "README.md");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const version = pkg.version;
const manifestUrl = `https://raw.githubusercontent.com/NIkitaTemerko/ShatteredWorlds/v${version}/system.json`;
const changelogUrl = `https://github.com/NIkitaTemerko/ShatteredWorlds/releases/tag/v${version}`;

let readme = readFileSync(readmePath, "utf8");

// Метки для блока манифеста
const topStart = "<!-- manifest-top-start -->";
const topEnd = "<!-- manifest-top-end -->";
// Формируем новый блок
const topBlock = [
  topStart,
  `**Manifest**: ${manifestUrl}`,
  `**Changelog**: [v${version}](${changelogUrl})`,
  topEnd
].join("\n");

if (readme.includes(topStart) && readme.includes(topEnd)) {
  // Заменяем существующий блок по regex, корректно эскейпим \s\S
  const regex = new RegExp(`${topStart}[\\s\\S]*?${topEnd}`, "m");
  readme = readme.replace(regex, topBlock);
} else {
  // Вставляем новый блок после заголовка
  const lines = readme.split("\n");
  const insertIndex = lines.findIndex(line => line.startsWith("# ")) + 1;
  lines.splice(insertIndex, 0, "", topBlock, "");
  readme = lines.join("\n");
}

// Пишем обратно
writeFileSync(readmePath, readme, "utf8");
console.log(`✅ README.md updated: manifest=${manifestUrl}`);
