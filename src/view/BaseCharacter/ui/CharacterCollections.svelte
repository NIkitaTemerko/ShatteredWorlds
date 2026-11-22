<script lang="ts">
  import { onMount } from 'svelte';
  import { getSheetEvents } from './sheetEvents';
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import { ItemFactory } from '../../../documents/Item/ItemFactory';
  import type {
    AbilitySystem,
    ActiveAbilityKind,
    PassiveAbilityKind,
  } from '../../../documents/Item/types/AbilityDataTypes';
  import {
    ACTIVE_KINDS,
    PASSIVE_KINDS,
    ABILITY_CATEGORIES,
  } from '../../AbilityItem/constants/abilityConstants';
  import { t, type I18nKey } from '../../../shared/i18n';
  import {
    isItemEquipped,
    setItemEquipped,
  } from '../../../shared/helpers/Character/equipmentState';
  import { getCharacterAbilityPool } from '../../../shared/helpers/Character/getCharacterAbilityPool';
  import { getEquipmentLinkedAbilitySources } from '../../../shared/helpers/Character/getEquipmentLinkedAbilities';
  import { mapInventoryToFlatItems } from '../../../entities/inventory/lib/mappers';
  import { mapSpellsToFlatItems } from '../../../entities/spell/model/mappers';
  import { mapAbilitiesToFlatItems } from '../../../entities/ability/model/mappers';
  import { buildTreeFromFlatList } from '../../../shared/ui/tree/treeUtils';
  import type { TreeNode } from '../../../shared/ui/tree';
  import AbilityDraftFields from './AbilityDraftFields.svelte';
  import SheetPanel from './SheetPanel.svelte';
  let {
    actor,
    section,
  }: { actor: ShwActor<'character'>; section: 'inventory' | 'spells' | 'abilities' } = $props();
  let query = $state('');
  const sheetEvents = getSheetEvents();
  let filter = $state('all');
  let collapsed = $state(new Set<string>());
  let selected = $state<ShwItem | null>(null);
  let editDescription = $state(false);
  let description = $state('');
  let draftName = $state('');
  let draftCategory = $state('active');
  let draftKind = $state('attack');
  let draftAbility = $state<AbilitySystem | null>(null);
  let originalAbility = '';
  let deleting = $state(false);
  let discardPrompt = $state(false);
  let pendingNavigation = $state<(() => void) | null>(null);
  let changingEquipment = $state(false);
  let reviewChanges = $state(false);
  let changes = $state<Record<string, boolean>>({});
  let busy = $state(false);
  let error = $state('');
  const owned = $derived(Array.from(actor.items));
  const sources = $derived(getEquipmentLinkedAbilitySources(actor));
  const items = $derived(
    section === 'abilities'
      ? getCharacterAbilityPool(actor)
      : owned.filter((item) =>
          section === 'spells'
            ? item.type === 'spell'
            : item.type !== 'spell' && item.type !== 'ability',
        ),
  );
  const plural = $derived.by(() => {
    const count = items.length;
    const form =
      count % 100 >= 11 && count % 100 <= 14
        ? 'many'
        : count % 10 === 1
          ? 'one'
          : count % 10 >= 2 && count % 10 <= 4
            ? 'few'
            : 'many';
    const prefix =
      section === 'inventory'
        ? 'inventory.itemPlurals'
        : section === 'spells'
          ? 'spells.spellPlurals'
          : 'abilities.abilityPlurals';
    return t(`${prefix}.${form}`);
  });
  const equipped = $derived(items.filter(isItemEquipped));
  const linked = $derived(items.filter((item) => sources.has(item.id ?? item._id ?? '')));
  const flatItems = $derived(
    section === 'spells'
      ? mapSpellsToFlatItems(items)
      : section === 'abilities'
        ? mapAbilitiesToFlatItems(items, { equipmentLinkedSourceNames: sources })
        : mapInventoryToFlatItems(items),
  );
  const filtered = $derived(
    flatItems.filter((flat) => {
      const item = flat.data as ShwItem;
      const match = `${flat.label} ${item.system.description ?? ''}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase());
      return (
        match &&
        (filter === 'all' ||
          (filter === 'equipped'
            ? isItemEquipped(item)
            : filter === 'backpack'
              ? !isItemEquipped(item)
              : filter === 'linked'
                ? sources.has(flat.id)
                : !sources.has(flat.id)))
      );
    }),
  );
  const nodes = $derived(
    buildTreeFromFlatList(
      [...filtered]
        .sort((a, b) =>
          section === 'inventory'
            ? Number(isItemEquipped(b.data as ShwItem)) - Number(isItemEquipped(a.data as ShwItem))
            : 0,
        )
        .map((flat) =>
          section !== 'inventory'
            ? flat
            : {
                ...flat,
                path: [
                  t(isItemEquipped(flat.data as ShwItem) ? 'newUi.equipped' : 'newUi.backpack'),
                  ...flat.path.slice(isItemEquipped(flat.data as ShwItem) ? 1 : 0),
                ],
              },
        ),
    ),
  );
  onMount(() => {
    const ids = new Set<string>();
    const visit = (list: TreeNode[], depth = 0) =>
      list.forEach((node, index) => {
        if (!node.isLeaf) {
          if (depth > 0 ? index > 0 : section !== 'inventory' && index > 0) ids.add(node.id);
          visit(node.children ?? [], depth + 1);
        }
      });
    visit(nodes);
    collapsed = ids;
    const beforeNavigate = (event: Event) => {
      if (selected && editDescription && isDirty()) {
        event.preventDefault();
        pendingNavigation = (event as CustomEvent<() => void>).detail;
        discardPrompt = true;
      }
    };
    sheetEvents.addEventListener('shw-character-navigate', beforeNavigate);
    return () => sheetEvents.removeEventListener('shw-character-navigate', beforeNavigate);
  });
  const pending = $derived(
    items.filter(
      (item) => item.id && item.id in changes && changes[item.id] !== isItemEquipped(item),
    ),
  );
  const selectedLinked = $derived(
    selected ? sources.has(selected.id ?? selected._id ?? '') : false,
  );
  const plainDescription = (item: ShwItem) =>
    String(item.system.description ?? '')
      .replace(/<[^>]*>/g, ' ')
      .trim();
  function leafCount(node: TreeNode): number {
    return node.isLeaf
      ? 1
      : (node.children ?? []).reduce((sum, child) => sum + leafCount(child), 0);
  }
  function toggle(id: string) {
    if (collapsed.has(id)) collapsed.delete(id);
    else collapsed.add(id);
    collapsed = new Set(collapsed);
  }
  function open(item: ShwItem) {
    if (selected && editDescription && isDirty()) {
      pendingNavigation = () => open(item);
      discardPrompt = true;
      return;
    }
    selected = item;
    description = String(item.system.description ?? '');
    draftName = item.name;
    draftAbility = item.type === 'ability' ? JSON.parse(JSON.stringify(item.system)) : null;
    originalAbility = JSON.stringify(draftAbility);
    if (item.type === 'ability') {
      const system = item.system as AbilitySystem;
      draftCategory = system.category;
      draftKind = system.category === 'active' ? system.activeKind : system.passiveKind;
    }
    editDescription = false;
    deleting = false;
    discardPrompt = false;
    error = '';
  }
  function isDirty() {
    if (!selected) return false;
    const system = selected.system as AbilitySystem;
    return (
      JSON.stringify(draftAbility) !== originalAbility ||
      description !== String(system.description ?? '') ||
      draftName !== selected.name ||
      (selected.type === 'ability' &&
        (draftCategory !== system.category ||
          draftKind !== (system.category === 'active' ? system.activeKind : system.passiveKind)))
    );
  }
  function changeAbilityCategory() {
    draftKind = draftCategory === 'active' ? 'attack' : 'stat-bonus';
    if (!draftAbility) return;
    const common = {
      name: draftName,
      description,
      weight: draftAbility.weight,
      rarity: draftAbility.rarity,
    };
    draftAbility =
      draftCategory === 'active'
        ? ItemFactory.createAbility('active', 'attack', common)
        : ItemFactory.createAbility('passive', 'stat-bonus', common);
  }
  async function saveSelected() {
    if (!selected) return;
    if (!draftName.trim()) throw new Error(t('newUi.invalidValues'));
    const patch: Record<string, unknown> = {
      name: draftName.trim(),
      'system.description': description,
    };
    if (selected.type === 'ability') {
      if (draftAbility) {
        patch.system = {
          ...draftAbility,
          description,
          ...(draftAbility.category === 'active'
            ? { activeKind: draftKind }
            : { passiveKind: draftKind }),
        };
      }
    }
    await selected.update(patch);
    editDescription = false;
  }
  function closeSelected() {
    if (selected && editDescription && isDirty()) {
      discardPrompt = true;
      return false;
    }
    selected = null;
    return true;
  }
  function collapseAll() {
    const ids: string[] = [];
    const walk = (list: TreeNode[]) =>
      list.forEach((node) => {
        if (!node.isLeaf) {
          ids.push(node.id);
          walk(node.children ?? []);
        }
      });
    walk(nodes);
    collapsed = new Set(ids);
  }
  async function perform(action: () => Promise<unknown>, close = false) {
    busy = true;
    error = '';
    try {
      await action();
      if (close) {
        const navigate = pendingNavigation;
        pendingNavigation = null;
        selected = null;
        navigate?.();
      }
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }
  function selectEquipment(item: ShwItem, checked: boolean) {
    if (!item.id) return;
    const next = { ...changes };
    if (checked) next[item.id] = !isItemEquipped(item);
    else delete next[item.id];
    changes = next;
  }

  async function applyEquipment() {
    await perform(async () => {
      await actor.updateEmbeddedDocuments(
        'Item',
        pending.map((item) => ({ _id: item.id, 'system.equipped': changes[item.id!] })),
      );
      reviewChanges = false;
      changingEquipment = false;
      changes = {};
    });
  }
  function subtitle(item: ShwItem) {
    const flat = flatItems.find((row) => row.id === (item.id ?? item._id));
    const names = sources.get(item.id ?? item._id ?? '');
    return item.type === 'ability'
      ? names?.length
        ? `${t('newUi.source')}: ${names.join(', ')}`
        : t('newUi.ownAbility')
      : (flat?.path.slice(0, -1).join(' · ') ?? '');
  }
</script>

<div class="section-heading">
  <div class="collection-title">
    <h2>{t(`newUi.${section}`)}</h2>
    <span class="muted">{items.length} {plural}</span>
  </div>
  {#if section === 'inventory'}<button
      type="button"
      class="outline-button"
      onclick={() => {
        changingEquipment = !changingEquipment;
        changes = {};
      }}>{t(changingEquipment ? 'newUi.cancel' : 'newUi.changeEquipment')}</button
    >{/if}
</div>
<label class="collection-search"
  ><span class="sr-only">{t('newUi.search')}</span><input
    type="search"
    bind:value={query}
    placeholder={t('newUi.search')}
  /></label
>
<div class="collection-filters">
  <button type="button" class:active={filter === 'all'} onclick={() => (filter = 'all')}
    >{t(section === 'spells' ? 'newUi.allSchools' : 'newUi.all')} {items.length}</button
  >
  {#if section === 'inventory'}
    <button type="button" class:active={filter === 'equipped'} onclick={() => (filter = 'equipped')}
      >{t('newUi.equipped')} {equipped.length}</button
    ><button
      type="button"
      class:active={filter === 'backpack'}
      onclick={() => (filter = 'backpack')}
      >{t('newUi.backpack')} {items.length - equipped.length}</button
    >
  {:else if section === 'abilities'}
    <button type="button" class:active={filter === 'own'} onclick={() => (filter = 'own')}
      >{t('newUi.own')} {items.length - linked.length}</button
    ><button type="button" class:active={filter === 'linked'} onclick={() => (filter = 'linked')}
      >{t('newUi.fromEquipment')} {linked.length}</button
    >
  {/if}
  <button type="button" class="collapse-all" onclick={collapseAll}>{t('newUi.collapseAll')}</button>
</div>
{#if changingEquipment}<p class="muted">{t('newUi.equipmentHint')}</p>{/if}
<div class="collection-list">
  {#snippet tree(list: TreeNode[], depth: number)}
    {#each list as node (node.id)}
      {#if node.isLeaf}
        {@const item = node.data as ShwItem}
        <div
          class="collection-item"
          class:selected={selected?.id === item.id}
          style:margin-left="{depth * 16}px"
        >
          {#if changingEquipment && item.type === 'equipment'}<input
              type="checkbox"
              aria-label={`${t(isItemEquipped(item) ? 'newUi.unequip' : 'newUi.equip')} · ${item.name}`}
              checked={pending.some(candidate => candidate.id === item.id)}
              onchange={(e) => selectEquipment(item, e.currentTarget.checked)}
            />{/if}
          <button type="button" class="item-description-button" onclick={() => open(item)}
            ><i
              class={section === 'spells'
                ? 'fas fa-book-open'
                : section === 'abilities'
                  ? 'fas fa-sparkles'
                  : item.type === 'equipment'
                    ? 'fas fa-shield-alt'
                    : 'fas fa-box'}
              aria-hidden="true"
            ></i><span><strong>{node.label}</strong><small>{subtitle(item)}</small></span></button
          >
          {#if section === 'inventory' && item.type === 'equipment' && !changingEquipment}<button
              type="button"
              class="outline-button item-action"
              disabled={busy}
              onclick={() => perform(() => setItemEquipped(item, !isItemEquipped(item)))}
              >{t(isItemEquipped(item) ? 'newUi.unequip' : 'newUi.equip')}</button
            >
          {:else}<button type="button" class="outline-button item-action" onclick={() => open(item)}
              >{t('newUi.open')}</button
            >{/if}
        </div>
      {:else}
        {@const sectionHeader = section === 'inventory' && depth === 0}
        <button
          type="button"
          class="collection-group"
          class:collection-section={sectionHeader}
          style:margin-left="{depth * 16}px"
          style:width="calc(100% - {depth * 16}px)"
          aria-expanded={query.trim() ? true : !collapsed.has(node.id)}
          onclick={() => toggle(node.id)}
          ><span class="collection-group-label">
            {#if !sectionHeader}<span aria-hidden="true"
                >{collapsed.has(node.id) && !query.trim() ? '▸' : '▾'}</span
              >{/if}
            <span>{sectionHeader ? node.label : `${node.label} · ${leafCount(node)}`}</span>
          </span>{#if sectionHeader}<span class="count-badge">{leafCount(node)}</span>{/if}</button
        >
        {#if query.trim() || !collapsed.has(node.id)}{@render tree(
            node.children ?? [],
            sectionHeader ? 1 : depth + 1,
          )}{/if}
      {/if}
    {/each}
  {/snippet}
  {@render tree(nodes, 0)}
  {#if nodes.length === 0}<p class="empty-state">
      {t(query.trim() ? 'newUi.noResults' : 'newUi.empty')}
    </p>{/if}
</div>
{#if error}<p role="alert">{error}</p>{/if}
{#if changingEquipment}<footer class="equipment-footer">
    <span>{t('newUi.selectedChanges')}: {pending.length}</span><button
      type="button"
      class="primary"
      disabled={!pending.length || busy}
      onclick={() => (reviewChanges = true)}>{t('newUi.reviewChanges')}</button
    >
  </footer>{/if}
{#if reviewChanges}
  <SheetPanel
    title={t('newUi.reviewChanges')}
    onClose={() => {
      reviewChanges = false;
    }}
  >
    {#each pending as item}<p>
        {t(changes[item.id!] ? 'newUi.equip' : 'newUi.unequip')} · {item.name}
      </p>{/each}
    <button type="button" class="primary wide" disabled={busy} onclick={applyEquipment}
      >{t('newUi.apply')}</button
    >
  </SheetPanel>
{/if}
{#if selected}
  <SheetPanel
    title={editDescription ? t('newUi.edit') + ' · ' + selected.name : selected.name}
    onClose={closeSelected}
  >
    {#if discardPrompt}
      <h3>{t('newUi.unsavedChanges')}</h3>
      <div class="panel-actions">
        <button
          type="button"
          class="primary"
          disabled={busy}
          onclick={() => perform(saveSelected, true)}>{t('newUi.saveChanges')}</button
        ><button
          type="button"
          class="outline-button"
          onclick={() => {
            const navigate = pendingNavigation;
            pendingNavigation = null;
            selected = null;
            navigate?.();
          }}>{t('newUi.discard')}</button
        ><button
          type="button"
          class="outline-button"
          onclick={() => {
            discardPrompt = false;
            pendingNavigation = null;
          }}>{t('newUi.return')}</button
        >
      </div>
    {:else}
      <p class="coefficient">{subtitle(selected)}</p>
      {#if editDescription}<div class="item-edit-fields">
          <label class="form-field">{t('newUi.itemName')}<input bind:value={draftName} /></label>
          {#if selected.type === 'ability'}<div class="item-edit-types">
              <label class="form-field"
                >{t('ability.header.categoryLabel')}<select
                  bind:value={draftCategory}
                  onchange={changeAbilityCategory}
                  >{#each ABILITY_CATEGORIES as option}<option value={option.value}
                      >{t(option.label as I18nKey)}</option
                    >{/each}</select
                ></label
              >
              <label class="form-field"
                >{t('newUi.kind')}<select bind:value={draftKind}
                  >{#each draftCategory === 'active' ? ACTIVE_KINDS : PASSIVE_KINDS as option}<option
                      value={option.value}>{t(option.label as I18nKey)}</option
                    >{/each}</select
                ></label
              >
            </div>{/if}
          <label class="form-field"
            >{t('item.description.title')}<textarea rows="6" bind:value={description}
            ></textarea></label
          >
          {#if draftAbility && draftAbility.category === draftCategory}<AbilityDraftFields
              bind:system={draftAbility}
            />{/if}
          {#if isDirty()}<p class="coefficient">{t('newUi.hasUnsavedChanges')}</p>{/if}
          <button
            type="button"
            class="primary wide"
            disabled={busy}
            onclick={() =>
              perform(async () => {
                await saveSelected();
                editDescription = false;
              })}>{t('newUi.saveChanges')}</button
          >
          <button
            type="button"
            class="outline-button"
            onclick={() => {
              if (isDirty()) discardPrompt = true;
              else editDescription = false;
            }}>{t('newUi.cancel')}</button
          >
        </div>
      {:else}<p class="item-description">
          {plainDescription(selected) || t('newUi.noDescription')}
        </p>{/if}
      {#if selected.type === 'equipment' && !editDescription}
        <div class="panel-actions">
          <button
            type="button"
            class="primary"
            disabled={busy}
            onclick={() =>
              perform(() => setItemEquipped(selected!, !isItemEquipped(selected!)), true)}
            >{t(isItemEquipped(selected) ? 'newUi.unequip' : 'newUi.equip')}</button
          >
          {#if section === 'inventory'}<button
              type="button"
              class="outline-button"
              onclick={() => {
                selected = null;
                changingEquipment = true;
                changes = {};
              }}>{t('newUi.changeEquipment')}</button
            >{/if}
        </div>
      {/if}
      {#if deleting}<p>{t('newUi.deleteConfirm')} «{selected.name}»?</p>
        <div class="panel-actions">
          <button type="button" class="outline-button" onclick={() => (deleting = false)}
            >{t('newUi.cancel')}</button
          ><button
            type="button"
            class="danger-button"
            disabled={busy}
            onclick={() => perform(() => selected!.delete(), true)}>{t('newUi.delete')}</button
          >
        </div>
      {:else if !editDescription}<div class="panel-actions">
          <button type="button" class="outline-button" onclick={() => selected?.sheet?.render(true)}
            >{t('newUi.fullSheet')}</button
          >
          {#if !selectedLinked}<button
              type="button"
              class="outline-button"
              onclick={() => {
                if (editDescription && isDirty()) discardPrompt = true;
                else editDescription = !editDescription;
              }}>{t('newUi.edit')}</button
            ><button type="button" class="danger-button" onclick={() => (deleting = true)}
              >{t('newUi.delete')}</button
            >{/if}
        </div>{/if}
      {#if section === 'inventory' && selected.type === 'consumable' && 'quantity' in selected.system}<label
          class="form-field"
          >{t('inventory.menu.quantity')}<input
            type="number"
            min="1"
            max={selected.system.stackLimit ?? undefined}
            value={selected.system.quantity}
            onchange={(e) => {
              const value = Number(e.currentTarget.value);
              if (Number.isFinite(value) && value >= 1)
                perform(() =>
                  selected!.update({
                    'system.quantity': Math.min(
                      value,
                      Number(
                        selected!.system && 'stackLimit' in selected!.system
                          ? (selected!.system.stackLimit ?? Infinity)
                          : Infinity,
                      ),
                    ),
                  }),
                );
            }}
          /></label
        >{/if}
      {#if selectedLinked}<p class="muted">{t('newUi.linkedHint')}</p>
        {#each owned.filter((item) => isItemEquipped(item) && 'linkedItemIds' in item.system && item.system.linkedItemIds?.includes(selected?.id ?? '')) as source}
          <button type="button" class="source-link" onclick={() => open(source)}
            ><span>{t('newUi.source')}: {source.name}</span><span>›</span></button
          >
        {/each}
      {/if}
      {#if error}<p role="alert">{error}</p>{/if}
    {/if}
  </SheetPanel>
{/if}
