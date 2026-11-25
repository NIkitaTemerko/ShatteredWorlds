<script lang="ts">
  import { onMount } from 'svelte';
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';
  import type { StatModifier } from '../../../documents/Item/types/AbilityDataTypes';
  import { CHARACTER_STAT_OPTIONS } from '../../../shared/model/characterStatPaths';
  import { t, localize } from '../../../shared/i18n';
  import ItemField from './ItemField.svelte';
  let { system, update, disabled, linkedItems }: {
    system: EquipmentSystem;
    update: (path: string, value: unknown) => Promise<void>;
    disabled: boolean;
    linkedItems?: Map<string, ShwItem>;
  } = $props();
  let revision = $state(0);
  let openIndex = $state<number | null>(null);
  let adding = $state(false);
  let dragging = $state(false);
  let linkError = $state('');
  const modifiers = $derived(system.statBonuses?.modifiers ?? []);
  const options = CHARACTER_STAT_OPTIONS.map(option => ({
    value: option.value,
    label: option.attributeKey ? localize(option.labelKey, { attribute: t(option.attributeKey) }) : t(option.labelKey),
  }));
  const labelFor = (stat: string) => options.find(option => option.value === stat)?.label ?? stat;
  const links = $derived.by(() => {
    revision;
    return (system.linkedItemIds ?? []).map(id => ({
      id, item: linkedItems?.get(id) ?? (typeof game !== 'undefined' ? game.items?.get(id) as ShwItem | undefined : undefined),
    }));
  });
  onMount(() => {
    const refresh = () => { revision++; };
    const hooks = ['createItem', 'updateItem', 'deleteItem'] as const;
    for (const hook of hooks) Hooks.on(hook, refresh);
    return () => { for (const hook of hooks) Hooks.off(hook, refresh); };
  });
  async function changeModifier(index: number, patch: Partial<StatModifier>) {
    await update('statBonuses', { ...system.statBonuses, modifiers: modifiers.map((m, i) => i === index ? { ...m, ...patch } : m) });
  }
  async function add(stat: string | number) {
    openIndex = modifiers.length;
    adding = false;
    await update('statBonuses', { ...system.statBonuses, modifiers: [...modifiers, { stat: String(stat), mode: 'add', value: 0 }] });
  }
  async function remove(index: number) {
    await update('statBonuses', { ...system.statBonuses, modifiers: modifiers.filter((_, i) => i !== index) });
    if (openIndex === index) openIndex = null;
    else if (openIndex !== null && openIndex > index) openIndex--;
  }
  async function drop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    if (disabled) return;
    linkError = '';
    try {
      const data = JSON.parse(event.dataTransfer?.getData('text/plain') ?? '');
      if (data.type !== 'Item' || typeof data.uuid !== 'string' || !/^Item\.[^.]+$/.test(data.uuid)) {
        linkError = t('itemUi.wrongDrop'); return;
      }
      const id = data.uuid.slice(5);
      const candidate = linkedItems?.get(id) ?? game.items?.get(id) as ShwItem | undefined;
      if (!candidate || !['ability', 'spell'].includes(candidate.type)) { linkError = t('itemUi.wrongDrop'); return; }
      if (system.linkedItemIds.includes(id)) { linkError = t('itemUi.duplicateLink'); return; }
      await update('linkedItemIds', [...system.linkedItemIds, id]);
    } catch { linkError = t('itemUi.wrongDrop'); }
  }
</script>

<section class="item-bonuses">
  <div class="item-section-heading"><h2>{t('equipment.bonuses.title')}</h2>
    <button type="button" class="item-text-action" {disabled} onclick={() => (adding = !adding)}>+ {t('itemUi.addBonus')}</button>
  </div>
  {#if adding}<div class="item-add-picker"><ItemField label={t('itemUi.parameter')} value=""
    options={[{ value: '', label: '—' }, ...options]} onChange={(value) => value && add(value)} {disabled} /></div>{/if}
  {#if !modifiers.length}<div class="item-empty"><strong>{t('itemUi.noBonuses')}</strong><p>{t('itemUi.bonusHint')}</p></div>{/if}
  {#each modifiers as modifier, index}
    <div class="item-expandable" class:is-open={openIndex === index}>
      <div class="item-effect-heading">
        <button type="button" class="item-expand" aria-expanded={openIndex === index} onclick={() => (openIndex = openIndex === index ? null : index)}>
          <span class="item-chevron" aria-hidden="true"><i class={openIndex === index ? 'fas fa-chevron-down' : 'fas fa-chevron-right'}></i></span>
          <span>{labelFor(modifier.stat)}</span><strong class="item-number">{modifier.mode === 'add' ? (modifier.value >= 0 ? '+' : '') : modifier.mode === 'mul' ? '×' : '='}{modifier.value}</strong>
        </button>
        <button type="button" class="item-remove" aria-label={t('itemUi.removeBonus')} {disabled} onclick={() => remove(index)}>×</button>
      </div>
      {#if openIndex === index}<div class="item-effect-fields modifier-fields">
        <ItemField label={t('itemUi.parameter')} value={modifier.stat} {options} {disabled} onChange={value => changeModifier(index, { stat: String(value) })} />
        <ItemField label={t('itemUi.operation')} value={modifier.mode} {disabled}
          options={[{ value: 'add', label: '+' }, { value: 'mul', label: '×' }, { value: 'override', label: '=' }]}
          onChange={value => changeModifier(index, { mode: value as StatModifier['mode'] })} />
        <ItemField label={t('itemUi.value')} type="number" value={modifier.value} {disabled} onChange={value => changeModifier(index, { value: Number(value) })} />
      </div>{/if}
    </div>
  {/each}
</section>
<section class="item-links">
  <div class="item-section-heading"><h2>{t('itemUi.linked')}</h2><span class="item-count">{links.length}</span></div>
  {#each links as entry (entry.id)}
    <div class="item-linked-row" class:missing={!entry.item}>
      <div class="item-linked-icon"><i class={entry.item?.type === 'spell' ? 'fas fa-book-open' : 'fas fa-bolt'} aria-hidden="true"></i></div>
      <button type="button" class="item-linked-name" disabled={!entry.item} onclick={() => entry.item?.sheet?.render(true)}>
        <strong>{entry.item?.name ?? t('itemUi.missingLink')}</strong>
        {#if entry.item}<small>{t(entry.item.type === 'spell' ? 'newUi.spells' : 'newUi.abilities')}</small>{/if}
      </button>
      <button type="button" class="item-remove" {disabled} aria-label={`${t('itemUi.removeLink')} · ${entry.item?.name ?? entry.id}`}
        onclick={() => update('linkedItemIds', system.linkedItemIds.filter(id => id !== entry.id))}>×</button>
    </div>
  {/each}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="item-drop-zone" class:is-dragging={dragging}
    ondragover={(e) => { if (!disabled) { e.preventDefault(); dragging = true; if (e.dataTransfer) e.dataTransfer.dropEffect = 'link'; } }}
    ondragleave={(e) => { if (!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) dragging = false; }} ondrop={drop}>
    <span>+ {t('itemUi.dropHint')}</span><small>{t('itemUi.dropSource')}</small>
  </div>
  {#if linkError}<p role="alert" class="item-error">{linkError}</p>{/if}
</section>
