# Shattered Worlds ⚡️🌌

**Техно-фэнтези RPG система для Foundry VTT с элементами роглайта**

> 🛰️ Добро пожаловать в осколки миров, где магия пересекается с кибернетикой!

---

## 🚀 Быстрый старт

1. **Установка**
   В Foundry VTT → **Setup** → **Install System** → вставьте манифест:
   ```
   https://raw.githubusercontent.com/NIkitaTemerko/ShatteredWorlds/main/system.json
   ```

2. **Создание мира**
   Выберите "Shattered Worlds" и нажмите **Create World**.

3. **Запуск**
   Настройте персонажей и начинайте приключение!

---

## 🎮 Основные возможности

### 📋 Типы персонажей
- **Персонажи (Characters)** — полноценные листы с атрибутами, здоровьем, навыками и инвентарём
- **NPC** — упрощённые листы для врагов и неигровых персонажей

### 🎒 Система предметов
- **Расходники (Consumables)** — бомбы, зелья, свитки, яды, еда с автостакингом
- **Способности (Abilities)** — активные и пассивные умения с деревом способностей
- **Заклинания (Spells)** — магическая система

### 🎯 Игровая механика
- Система атрибутов с автоматическим расчётом бонусов
- Динамическое здоровье и энергия
- Древо способностей с поиском и фильтрацией
- Автоматический стакинг расходников (до 100 шт.)
- Защита от дубликатов уникальных предметов

---

## 🛠 Технологии

Система построена на современном стеке:

- **Foundry VTT v12+** — игровая платформа
- **Svelte 5** — реактивный UI с runes API
- **TypeScript** — типобезопасный код
- **Vite** — быстрая сборка и dev-сервер
- **Tailwind CSS v4** — стилизация
- **Biome** — линтинг и форматирование

---

## 👨‍💻 Разработка

### Требования
- Node.js 18+
- pnpm 8+
- Foundry VTT установлен

### Команды

```bash
# Установка зависимостей
pnpm install

# Сборка для продакшена
pnpm build

# Сборка в режиме разработки с отслеживанием изменений
pnpm watch

# Dev-сервер Vite (альтернативный вариант)
pnpm dev

# Обновление версии
pnpm bump:patch  # 0.12.9 → 0.12.10
pnpm bump:minor  # 0.12.9 → 0.13.0
pnpm bump:major  # 0.12.9 → 1.0.0

# Создание архива для релиза
pnpm pack
```

### Workflow разработки

1. Создайте символическую ссылку из папки систем Foundry на репозиторий:
   ```bash
   cd /path/to/foundry/Data/systems
   ln -s /path/to/ShatteredWorlds shattered-worlds
   ```

2. Запустите Foundry VTT

3. В терминале репозитория запустите:
   ```bash
   pnpm watch
   ```

4. Вносите изменения в коде — они автоматически пересобираются, перезагружайте страницу в браузере

---

## 📁 Структура проекта

```
src/
  documents/        # Foundry документы (Actor, Item, Token)
  entities/         # Доменные модели + UI (character, ability, consumable)
  features/         # Кроссфункциональные фичи (navigation, roll)
  helpers/          # Утилиты для подготовки данных
  sheets/           # Базовые классы листов (SvelteActorSheet)
  view/             # Приложения листов + Svelte-обёртки
  shared/ui/        # Переиспользуемые компоненты
```

### Архитектурный паттерн

- **Handlebars** рендерит минимальную оболочку `<form>`
- **Svelte 5** монтируется в `.svelte-sheet-body` для всего UI
- **ReactiveDocumentWrapper** подписывается на Foundry hooks для авто-обновления
- **Runes API** (`$state`, `$derived`, `$props`) вместо Svelte 4 stores

---

## 🌍 Локализация

- **English** (`lang/en.json`)
- **Русский** (`lang/ru.json`)

Доступ к переводам: `game.i18n.localize('SHW.KeyName')`

---

## 📚 Документация

- 📖 [GitHub Wiki](https://github.com/NIkitaTemerko/ShatteredWorlds/wiki)
- 🐞 [Issue Tracker](https://github.com/NIkitaTemerko/ShatteredWorlds/issues)

---

## 🤝 Вклад и лицензия

Этот проект распространяется под лицензией [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

---

> Удачных приключений в обломках миров! 🚀

<!-- manifest-start -->
**Changelog**: [v0.12.12](https://github.com/NIkitaTemerko/ShatteredWorlds/releases/tag/v0.12.12)
<!-- manifest-end -->
