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

  function handleSelect(node: TreeNode) {
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
  <div class="search-wrapper">
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId ?? undefined}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onStateChange={handleStateChange}
    />
    <div class="spell-count-bar">
      <span class="spell-count">{spellCount} {getPluralForm(spellCount)}</span>
    </div>
  </div>
</div>

<style>
  .spell-tree {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
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
    padding: 0.5rem;
    background: rgba(147, 51, 234, 0.15);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .spell-count {
    font-size: 13px;
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
