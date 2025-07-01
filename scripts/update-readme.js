/**
 * Обновляет в README.md секцию с manifest и changelog
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = pkg.version;
const manifestUrl = `https://raw.githubusercontent.com/NIkitaTemerko/ShatteredWorlds/v${version}/system.json`;
const changelogUrl = `https://github.com/NIkitaTemerko/ShatteredWorlds/releases/tag/v${version}`;

const readmePath = resolve(process.cwd(), "README.md");
let readme = readFileSync(readmePath, "utf8");

const start = "<!-- manifest-start -->";
const end   = "<!-- manifest-end -->";

const block = [
  start,
  `**Manifest**: ${manifestUrl}`,
  ``,
  `**Changelog**: [v${version}](${changelogUrl})`,
  end
].join("\n");

if (readme.includes(start) && readme.includes(end)) {
  // Замена существующего блока
  const regex = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
  readme = readme.replace(regex, block);
} else {
  // Добавление в конец
  readme = readme.trimEnd() + "\n\n" + block + "\n";
}

writeFileSync(readmePath, readme);
console.log(`✅ README.md updated for version ${version}`);
