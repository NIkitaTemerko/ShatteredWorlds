<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import type { TreeNode } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import { getSpellTreeState, updateSpellTreeState } from "../model/spellTreeState";
  import { mapSpellsToFlatItems } from "../model/mappers";

  interface Props {
    actorId: string;
    items: ShwItem[];
    spellCount: number;
    onSelectSpell?: (item: ShwItem) => void;
    onDeleteSpell?: (item: ShwItem) => void;
  }

  let { actorId, items, spellCount, onSelectSpell, onDeleteSpell }: Props = $props();

  const treeState = $derived(getSpellTreeState(actorId));

  const flatItems = $derived(mapSpellsToFlatItems(items));

  function handleStateChange(state: { searchQuery: string; expandedIds: Set<string>; selectedId?: string }) {
    updateSpellTreeState(actorId, state);
  }

  function getPluralForm(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return t("spells.spellPlurals.many");
    }
    if (lastDigit === 1) {
      return t("spells.spellPlurals.one");
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("spells.spellPlurals.few");
    }
    return t("spells.spellPlurals.many");
  }

  function handleEdit(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onSelectSpell?.(item);
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onDeleteSpell?.(item);
    }
  }
</script>

<div class="spell-tree">
  <div class="spell-count-bar">
    <span class="spell-count">{spellCount} {getPluralForm(spellCount)}</span>
  </div>
  <div class="search-wrapper">
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId ?? undefined}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStateChange={handleStateChange}
    />
  </div>
</div>

<style>
  .spell-tree {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    min-height: 12rem;
  }

  .search-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .spell-count-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.45rem;
    background: var(--shw-glass-fill-tint, rgb(72 48 112 / 32%));
    border: 1px solid var(--shw-color-border, #4a425c);
    border-radius: 0;
  }

  .spell-count {
    font-size: 13px;
    color: var(--shw-color-text, #e8e4f0);
    font-weight: 600;
    font-family: var(--shw-font, inherit);
  }
</style>
