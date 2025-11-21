#!/usr/bin/env node
/**
 * Скрипт читает версию из package.json
 * и пишет её в поле version в system.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// пути к файлам
const pkgPath = resolve(process.cwd(), 'package.json');
const sysPath = resolve(process.cwd(), 'system.json');

// читаем и парсим
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const sys = JSON.parse(readFileSync(sysPath, 'utf8'));

// синхронизируем
sys.version = pkg.version;

sys.download = `https://github.com/NIkitaTemerko/ShatteredWorlds/releases/download/v${pkg.version}/shattered-worlds.zip`;
// записываем обратно, сохраняя отступы
writeFileSync(sysPath, `${JSON.stringify(sys, null, 2)}\n`, 'utf8');

console.log(`✅ system.json version updated to ${sys.version}`);
console.log(`⬇️ system.json download updated to ${sys.download}`);
