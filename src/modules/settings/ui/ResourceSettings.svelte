<script lang="ts">
  import {
    getResourceCategories,
    getResourceTypes,
    resolveIconClass,
    useCategoryEditor,
    useTypeEditor,
    useResourcePersistence,
  } from '../lib';
  import { t } from '../../../shared/i18n';
  import CategoryCard from './CategoryCard.svelte';

  const persistence = useResourcePersistence(
    () => categoryEditor.categories,
    () => typeEditor.types,
    (cats, tps) => {
      categoryEditor.categories = cats;
      typeEditor.types = tps;
      categoryEditor.expandedCategories = new Set();
    },
  );

  const categoryEditor = useCategoryEditor(
    structuredClone(getResourceCategories()),
    persistence.markDirty,
  );

  const typeEditor = useTypeEditor(
    structuredClone(getResourceTypes()),
    () => categoryEditor.categories.map((c) => c.id),
    persistence.markDirty,
  );
</script>

<section class="settings-section">
  <header class="header">
    <button type="button" onclick={categoryEditor.addCategory}>
      <i class="fas fa-plus"></i>
      {t("settings.resources.addCategory")}
    </button>
  </header>

  <p class="hint">
    {t("settings.resources.hint")}
    {t("settings.resources.hintIcons")}
    <a href="https://fontawesome.com/search" target="_blank" rel="noopener">
      FontAwesome <i class="fas fa-external-link-alt" style="font-size: 0.65rem"></i></a
    >.
    {t("settings.resources.hintPaste")}
  </p>

  <div class="content">
    <div class="categories">
      {#each categoryEditor.categories as cat, catIndex}
        <CategoryCard
          category={cat}
          types={typeEditor.getTypesForCategory(cat.id)}
          isExpanded={categoryEditor.expandedCategories.has(cat.id)}
          onToggle={() => categoryEditor.toggleCategory(cat.id)}
          onUpdateCategory={(field, value) => categoryEditor.updateCategory(catIndex, field, value)}
          onRemoveCategory={() => categoryEditor.removeCategory(catIndex, typeEditor.getTypesForCategory(cat.id).length > 0)}
          onAddType={() => typeEditor.addType(cat.id)}
          onUpdateType={typeEditor.updateType}
          onRemoveType={typeEditor.removeType}
        />
      {/each}
    </div>

    {#if typeEditor.orphanTypes.length > 0}
      <div class="orphan-section">
        <div class="orphan-header">
          <i class="fas fa-exclamation-triangle" style="color: var(--color-level-error, #ef4444)"></i>
          <strong>{t("settings.resources.orphanTitle")} ({typeEditor.orphanTypes.length})</strong>
        </div>
        <div class="orphan-body">
          {#each typeEditor.orphanTypes as typ}
            <div class="orphan-row">
              <i class="{resolveIconClass(typ.icon)} orphan-icon"></i>
              <span class="orphan-label">{typ.label}</span>
              <select
                value={typ.category}
                onchange={(e) => typeEditor.updateType(typ.originalIndex, "category", e.currentTarget.value)}
              >
                {#each categoryEditor.categories as cat}
                  <option value={cat.id}>{cat.label}</option>
                {/each}
              </select>
              <button
                type="button"
                class="btn-remove"
                onclick={() => typeEditor.removeType(typ.originalIndex)}
                title={t("settings.resources.deleteType")}
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <footer class="footer">
    <button type="button" class="btn-reset" onclick={persistence.handleReset}>
      <i class="fas fa-undo"></i>
      {t("settings.resources.reset")}
    </button>
    <div class="footer-right">
      {#if persistence.hasChanges}
        <span class="unsaved">{t("settings.resources.unsaved")}</span>
      {/if}
      <button type="button" onclick={persistence.handleSave} disabled={persistence.isSaving || !persistence.hasChanges}>
        <i class="fas fa-save"></i>
        {persistence.isSaving ? t("settings.resources.saving") : t("settings.resources.save")}
      </button>
    </div>
  </footer>
</section>

<style>
  .settings-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0.25rem;
    flex-shrink: 0;
  }

  .hint {
    font-size: 0.8rem;
    opacity: 0.65;
    margin: 0 0 0.6rem;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Orphan types */
  .orphan-section {
    margin-top: 0.5rem;
    border: 1px solid var(--color-level-error, #ef4444);
    border-radius: 3px;
  }

  .orphan-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.4rem;
  }

  .orphan-body {
    padding: 0.3rem 0.4rem 0.4rem 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-top: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.06));
  }

  .orphan-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .orphan-icon {
    width: 16px;
    text-align: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .orphan-label {
    flex: 1;
    min-width: 0;
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

  /* Footer */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.1));
    flex-shrink: 0;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .unsaved {
    font-size: 0.75rem;
    color: var(--color-level-warning, #f59e0b);
  }

  .btn-reset {
    all: unset;
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0.5;
  }

  .btn-reset:hover {
    opacity: 1;
    color: var(--color-level-error, #ef4444);
  }
</style>
