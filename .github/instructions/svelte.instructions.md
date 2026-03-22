---
applyTo: "**/*.svelte"
---

# Svelte 5 Patterns

**CRITICAL:** Always use Svelte 5 runes syntax, NOT Svelte 4 patterns. This project uses Svelte 5.

## State Management: Use Runes, Not Stores

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  import { writable } from 'svelte/store';
  const count = writable(0);
</script>
<button on:click={() => $count++}>{$count}</button>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  let count = $state(0);
</script>
<button onclick={() => count++}>{count}</button>
```

## Component Props

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  export let actor;
  export let isEditable = true;
</script>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  interface Props { 
    actor: ShwActor<'character'>; 
    isEditable?: boolean;
  }
  let { actor, isEditable = true }: Props = $props();
</script>
```

## Reactive Computations

❌ **Svelte 4 (Don't use):**
```svelte
<script>
  export let value;
  $: doubled = value * 2;
  $: {
    console.log('Value changed:', value);
  }
</script>
```

✅ **Svelte 5 (Use this):**
```svelte
<script>
  let { value }: Props = $props();
  let doubled = $derived(value * 2);
  $effect(() => {
    console.log('Value changed:', value);
  });
</script>
```

## Event Handlers

❌ **Svelte 4 (Don't use):**
```svelte
<button on:click={handleClick}>Click</button>
<input on:change={handleChange} />
```

✅ **Svelte 5 (Use this):**
```svelte
<button onclick={handleClick}>Click</button>
<input onchange={handleChange} />
```

For custom events, use callback props:
```svelte
<!-- Parent -->
<TabNavigation {activeTab} onTabChange={handleTabChange} />

<!-- Child -->
interface Props { onTabChange: (tab: CharacterTab) => void; }
let { onTabChange }: Props = $props();
```

## Key Runes Reference

- `$state(value)` - Reactive state variable
- `$state<T>(value)` - Typed reactive state
- `$derived(expression)` - Computed value (like Svelte 4's `$:`)
- `$effect(() => {})` - Side effects (like Svelte 4's `$: {}` blocks)
- `$props()` - Component props (replaces `export let`)

**Note:** Legacy stores still exist in `*/store/` directories - migrate to runes when refactoring

## CSS Custom Properties for Theming

Components use CSS variables for type-specific colors:
```svelte
<div style="--dark:{colors.dark}; --light:{colors.light}">
  <!-- Component uses var(--dark) and var(--light) in CSS -->
</div>
```

## Component Communication

**Props down, callbacks up:**
```svelte
<script>
  // Parent component
  function handleTabChange(tab: CharacterTab) {
    activeTab = tab;
  }
</script>
<TabNavigation {activeTab} onTabChange={handleTabChange} />

<!-- Child component -->
<script>
  interface Props {
    activeTab: CharacterTab;
    onTabChange: (tab: CharacterTab) => void;
  }
  const { activeTab, onTabChange }: Props = $props();
</script>
```

## Common Pitfalls

### Svelte 5 vs Svelte 4 Patterns
❌ **Wrong:** `export let actor;` (Svelte 4)
✅ **Right:** `let { actor }: Props = $props();` (Svelte 5)

### Event Handlers
❌ **Wrong:** `<button on:click={handler}>` (works but not idiomatic)
✅ **Right:** `<button onclick={handler}>` (native DOM events in Svelte 5)

### Conditional Rendering by Type

Use discriminated unions for items:
```svelte
{#if item.system.consumableType === 'bomb'}
  <BombStats {item} />
{:else if item.system.consumableType === 'potion'}
  <PotionsAndFood {item} />
{/if}
```
