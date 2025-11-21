<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { t } from "../../../shared/i18n";
  import type { TreeNode } from "../../../shared/ui/tree";
  import { TreeWithSearch } from "../../../shared/ui/tree";
  import { getAbilityTreeState, updateAbilityTreeState } from "../model/abilityTreeState";
  import { mapAbilitiesToFlatItems } from "../model/mappers";

  interface Props {
    actorId: string;
    items: ShwItem[];
    abilityCount: number;
    onSelectAbility?: (item: ShwItem) => void;
    onDeleteAbility?: (item: ShwItem) => void;
  }

  let { actorId, items, abilityCount, onSelectAbility, onDeleteAbility }: Props = $props();

  const treeState = $derived(getAbilityTreeState(actorId));

  const flatItems = $derived(mapAbilitiesToFlatItems(items));

  function handleStateChange(state: { searchQuery: string; expandedIds: Set<string>; selectedId?: string }) {
    updateAbilityTreeState(actorId, state);
  }

  function getPluralForm(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return t("abilities.abilityPlurals.many");
    }
    if (lastDigit === 1) {
      return t("abilities.abilityPlurals.one");
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("abilities.abilityPlurals.few");
    }
    return t("abilities.abilityPlurals.many");
  }

  function handleSelect(node: TreeNode) {
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onSelectAbility?.(item);
    }
  }

  function handleDelete(node: TreeNode, e: Event) {
    e.stopPropagation();
    if (node.isLeaf && node.data) {
      const item = node.data as ShwItem;
      onDeleteAbility?.(item);
    }
  }
</script>

<div class="ability-tree">
  <div class="search-wrapper">
    <TreeWithSearch
      items={flatItems}
      initialSearchQuery={treeState.searchQuery}
      initialExpandedIds={treeState.expandedIds}
      initialSelectedId={treeState.selectedId}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onStateChange={handleStateChange}
    />
    <div class="ability-count-bar">
      <span class="ability-count">{abilityCount} {getPluralForm(abilityCount)}</span>
    </div>
  </div>
</div>

<style>
  .ability-tree {
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

  .ability-count-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background: rgba(59, 130, 246, 0.15);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .ability-count {
    font-size: 13px;
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
