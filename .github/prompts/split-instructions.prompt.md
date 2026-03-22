# Разбиение copilot-instructions.md на path-specific файлы

Разбей монолитный `.github/copilot-instructions.md` (935 строк) на систему path-specific instruction файлов по документации GitHub Copilot.

## Контекст

GitHub Copilot в VS Code поддерживает 3 типа инструкций:

| Тип | Путь | Когда применяется |
|---|---|---|
| **Repository-wide** | `.github/copilot-instructions.md` | Всегда, на все запросы |
| **Path-specific** | `.github/instructions/NAME.instructions.md` | Только при работе с файлами, подходящими под `applyTo` glob |
| **Agent instructions** | `AGENTS.md` | Для AI-агентов |

Path-specific инструкции **аддитивны** — если файл подпадает под glob, Copilot использует и repo-wide, и path-specific **вместе**.

## Формат файлов `.github/instructions/NAME.instructions.md`

```markdown
---
applyTo: "glob-pattern"
---

# Заголовок

Инструкции в Markdown формате...
```

## Целевая структура

### 1. `.github/copilot-instructions.md` (repo-wide, ~150 строк)

Оставить **только универсальное** — то, что нужно в каждом запросе:
- Project overview: Foundry VTT game system, Svelte 5 + TS + Vite + Tailwind v4
- FSD architecture: таблица слоёв, правило направления импортов, slice structure (`model/` + `ui/`)
- Build commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm pack`
- Language rules: русский в комментариях, английский в коде/коммитах
- Biome formatting: line width 100, single quotes, 2 spaces, `import type`
- File organization: краткое дерево `src/` с однострочными пояснениями

Убрать отсюда: все code snippets, подробные паттерны, domain-специфичные секции.

### 2. `.github/instructions/svelte.instructions.md`

```yaml
applyTo: "**/*.svelte"
```

Содержимое — всё про Svelte 5 из текущего файла:
- Runes vs Stores (`$state`, `$derived`, `$effect`, `$props`)
- Component Props pattern (interface Props + $props())
- Event handlers (`onclick` вместо `on:click`, callback props)
- Key Runes reference
- CSS Custom Properties for theming
- Pitfalls: Svelte 5 vs Svelte 4

### 3. `.github/instructions/foundry.instructions.md`

```yaml
applyTo: "src/documents/**,src/index.ts,src/sheets/**"
```

Содержимое — Foundry VTT integration:
- Document Model: ShwActor<K>, ShwItem, discriminated unions
- Data preparation flow: prepareBaseData → prepareDerivedData
- Item types: consumable, ability, spell, equipment + factory pattern
- Hooks usage: init → setup → ready, preCreateItem, updateItem
- Item Synchronization System: two-way sync, origin tracking, skipSync
- Type guards for actor types
- Hybrid Handlebars + Svelte rendering flow
- SvelteActorSheet / SveltItemSheet pattern

### 4. `.github/instructions/fsd-entities.instructions.md`

```yaml
applyTo: "src/entities/**,src/features/**"
```

Содержимое — domain entities и features:
- Shared Tree System: FlatItem, TreeNode, TreeBadge, buildTreeFromFlatList
- Badge pattern (domain knowledge в правильном слое)
- Menu delegation pattern (getMenuItems callback)
- Tree State Management (Map<string, TreeState> per actor)
- PopupMenu System: portal pattern, singleton, positioned
- Type-Safe i18n: t(), localize(), I18nKey autocomplete
- Component Communication: props down, callbacks up

### 5. `.github/instructions/view-sheets.instructions.md`

```yaml
applyTo: "src/view/**"
```

Содержимое — view layer паттерны:
- Sheet class structure: extends SvelteActorSheet, static Shell, get template
- Rendering flow: HBS shell → .svelte-sheet-body → Svelte mount
- ReactiveDocumentWrapper: hook subscription, version counter
- Sheet remounting strategy: _mountedActorId tracking
- getUpdateConsumable() utility pattern для safe updates
- Conditional rendering by item type (discriminated unions in templates)

### 6. `.github/instructions/item-system.instructions.md`

```yaml
applyTo: "src/shared/helpers/Item/**,src/documents/Item/**"
```

Содержимое — item data и stacking:
- Item Stacking & Duplicate Prevention (StackManager)
- Identity matching: baseId vs type:name
- Stack finding, auto-increment, overflow handling
- Data Loss on Partial Updates — getUpdateConsumable pattern
- Item factory pattern
- Consumable/Ability/Spell/Equipment data types

### 7. `.github/instructions/modules.instructions.md`

```yaml
applyTo: "src/modules/**"
```

Содержимое — standalone modules:
- Item Import: pipeline (parse → validate → dry-run → import), Zod schemas
- Shop Manager: merchant/location tree, localStorage state
- Encapsulated modules: expose only Application class

## Правила при разбиении

1. **Не дублируй** — если информация есть в repo-wide, не повторяй в path-specific
2. **Код-примеры** — переноси в path-specific файлы, в repo-wide только текст
3. **Каждый файл самодостаточен** в своей области — не требует чтения других instructions
4. **Язык инструкций** — английский (как в текущем файле)
5. **Создай директорию** `.github/instructions/` если не существует

## Порядок действий

1. Создай `.github/instructions/` директорию
2. Создавай файлы **по одному**, начиная с `svelte.instructions.md`
3. После создания всех path-specific файлов — **перепиши** `copilot-instructions.md`, убрав вынесенное
4. Проверь что ничего не потерялось: каждая секция оригинала должна быть в одном из файлов
