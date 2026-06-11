<script lang="ts">
  import type { ResourceCategorySetting, ResourceTypeSetting } from '../model/types';
  import { t } from '../../../shared/i18n';
  import TypeRow from './TypeRow.svelte';

  interface TypeWithIndex extends ResourceTypeSetting {
    originalIndex: number;
  }

  interface Props {
    category: ResourceCategorySetting;
    types: TypeWithIndex[];
    isExpanded: boolean;
    onToggle: () => void;
    onUpdateCategory: (field: keyof ResourceCategorySetting, value: string) => void;
    onRemoveCategory: () => void;
    onAddType: () => void;
    onUpdateType: (index: number, field: keyof ResourceTypeSetting, value: string) => void;
    onRemoveType: (index: number) => void;
  }

  let {
    category,
    types,
    isExpanded,
    onToggle,
    onUpdateCategory,
    onRemoveCategory,
    onAddType,
    onUpdateType,
    onRemoveType,
  }: Props = $props();
</script>

<div class="category" style="--cat-color: {category.color}">
  <div class="category-header">
    <button
      type="button"
      class="btn-toggle"
      onclick={onToggle}
      title={isExpanded ? t('settings.resources.collapse') : t('settings.resources.expand')}
    >
      <i class="fas" class:fa-chevron-right={!isExpanded} class:fa-chevron-down={isExpanded}></i>
    </button>

    <input
      type="color"
      class="color-picker"
      value={category.color}
      oninput={(e) => onUpdateCategory('color', e.currentTarget.value)}
    />

    <input
      type="text"
      value={category.id}
      placeholder="ID"
      class="input-id"
      oninput={(e) => onUpdateCategory('id', e.currentTarget.value)}
    />
    <input
      type="text"
      value={category.label}
      placeholder={t('settings.resources.placeholderName')}
      class="input-name"
      oninput={(e) => onUpdateCategory('label', e.currentTarget.value)}
    />

    <span class="badge">{types.length}</span>

    <button
      type="button"
      class="btn-remove"
      onclick={onRemoveCategory}
      title={t('settings.resources.deleteCategory')}
    >
      <i class="fas fa-trash"></i>
    </button>
  </div>

  {#if isExpanded}
    <div class="category-body">
      {#if types.length === 0}
        <p class="empty">{t('settings.resources.noTypes')}</p>
      {/if}

      {#each types as typ}
        <TypeRow
          icon={typ.icon}
          type={typ.type}
          label={typ.label}
          color={category.color}
          onUpdateType={(v) => onUpdateType(typ.originalIndex, 'type', v)}
          onUpdateLabel={(v) => onUpdateType(typ.originalIndex, 'label', v)}
          onUpdateIcon={(v) => onUpdateType(typ.originalIndex, 'icon', v)}
          onRemove={() => onRemoveType(typ.originalIndex)}
        />
      {/each}

      <button type="button" class="btn-add" onclick={onAddType}>
        <i class="fas fa-plus"></i> {t('settings.resources.addType')}
      </button>
    </div>
  {/if}
</div>

<style>
  .category {
    border: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.12));
    border-left: 3px solid var(--cat-color, #6b7280);
    border-radius: 3px;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.4rem;
  }

  .btn-toggle {
    all: unset;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0.6;
    font-size: 0.7rem;
    border-radius: 2px;
  }

  .btn-toggle:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
  }

  .color-picker {
    width: 22px;
    height: 22px;
    border: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.15));
    border-radius: 3px;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    background: transparent;
  }

  .input-id {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    width: 100px;
    flex-shrink: 0;
  }

  .input-name {
    flex: 1;
    min-width: 0;
  }

  .badge {
    font-size: 0.7rem;
    opacity: 0.5;
    padding: 0.05rem 0.35rem;
    border: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    flex-shrink: 0;
  }

  .btn-remove {
    all: unset;
    cursor: pointer;
    opacity: 0.25;
    padding: 0.15rem 0.3rem;
    flex-shrink: 0;
    font-size: 0.75rem;
  }

  .btn-remove:hover {
    opacity: 1;
    color: var(--color-level-error, #ef4444);
  }

  .category-body {
    padding: 0.3rem 0.4rem 0.4rem 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-top: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.06));
  }

  .empty {
    opacity: 0.4;
    font-size: 0.8rem;
    font-style: italic;
    margin: 0.2rem 0;
  }

  .btn-add {
    all: unset;
    cursor: pointer;
    align-self: flex-start;
    margin-top: 0.15rem;
    padding: 0.15rem 0.5rem;
    border: 1px dashed var(--color-border-light-tertiary, rgba(255, 255, 255, 0.2));
    border-radius: 3px;
    font-size: 0.75rem;
    opacity: 0.5;
  }

  .btn-add:hover {
    opacity: 1;
    border-color: var(--color-border-light-highlight, rgba(255, 255, 255, 0.4));
  }
</style>
