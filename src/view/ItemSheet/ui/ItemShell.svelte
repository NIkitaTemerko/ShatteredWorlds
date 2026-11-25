<script lang="ts">
  import { onMount } from 'svelte';
  import type { ShwItem } from '../../../documents/Item/ShwItem';
  import type { ConsumableData, ConsumableType } from '../../../documents/Item/types/ConsumableDataTypes';
  import type { EquipmentSystem } from '../../../documents/Item/types/EquipmentDataTypes';
  import type { ResourceData } from '../../../documents/Item/types/ResourceDataTypes';
  import { ItemFactory, getConsumableImage, getEquipmentImage, getResourceImage, isResourceDefaultImage } from '../../../documents/Item/ItemFactory';
  import { EQUIPMENT_SLOTS } from '../../../entities/inventory/model/constants';
  import { CONSUMABLE_TYPES, RARITY_TYPES, ACTIVATION_TYPES, PER_TYPES } from '../../../entities/consumable/model';
  import { getCategoryOptions, getTypeOptions } from '../../../entities/resource';
  import { t, resolveLabel } from '../../../shared/i18n';
  import ItemField from './ItemField.svelte';
  import EquipmentDetails from './EquipmentDetails.svelte';
  import ConsumableDetails from './ConsumableDetails.svelte';
  import './item-sheet.css';
  let { item, linkedItems }: { item: ShwItem; linkedItems?: Map<string, ShwItem> } = $props();
  let revision = $state(0);
  const system = $derived.by(() => { revision; return item.system as EquipmentSystem | ConsumableData | ResourceData; });
  const identity = $derived.by(() => { revision; return { name: item.name, img: item.img, readonly: item.isOwner === false }; });
  const equipment = $derived(item.type === 'equipment' ? system as EquipmentSystem : null);
  const consumable = $derived(item.type === 'consumable' ? system as ConsumableData : null);
  const resource = $derived(item.type === 'resource' ? system as ResourceData : null);
  const readonly = $derived(identity.readonly);
  let saving = $state(0);
  let error = $state('');
  let retry = $state<(() => Promise<void>) | null>(null);
  let failedAction: (() => Promise<unknown>) | null = null;
  let pendingType = $state<ConsumableType | null>(null);
  let queue: Promise<void> = Promise.resolve();
  const rarityOptions = [...RARITY_TYPES.slice(0, 3), { value: 'epic', label: 'itemUi.epic' }, ...RARITY_TYPES.slice(3)];
  const category = $derived(equipment
    ? `${t('itemUi.equipment')} · ${resolveLabel(EQUIPMENT_SLOTS.find(slot => slot.value === equipment.slot)?.label ?? equipment.slot)}`
    : consumable ? resolveLabel(CONSUMABLE_TYPES.find(type => type.value === consumable.consumableType)?.label ?? consumable.consumableType)
    : resource ? resolveLabel(getCategoryOptions().find(c => c.value === resource.category)?.label ?? resource.category) : '');
  const icon = $derived(equipment ? 'fa-shield-alt' : resource ? 'fa-gem' : consumable?.consumableType === 'bomb' ? 'fa-bomb' : consumable?.consumableType === 'scroll' ? 'fa-scroll' : consumable?.consumableType === 'food' ? 'fa-bread-slice' : consumable?.consumableType === 'poison' ? 'fa-skull-crossbones' : 'fa-flask');
  const showImage = $derived(identity.img && !['icons/svg/item-bag.svg', 'icons/svg/mystery-man.svg'].includes(identity.img));
  onMount(() => {
    const refresh = (changed: ShwItem) => { if (changed === item || changed.uuid === item.uuid && changed.id === item.id) revision++; };
    Hooks.on('updateItem', refresh);
    return () => Hooks.off('updateItem', refresh);
  });
  async function save(action: () => Promise<unknown>) {
    if (readonly) return;
    saving++;
    const run = async () => {
      try {
        await action(); revision++;
        if (failedAction === action) { error = ''; retry = null; failedAction = null; }
      }
      catch (e) { error = `${t('itemUi.saveFailed')} ${e instanceof Error ? e.message : String(e)}`; failedAction = action; retry = () => save(action); }
      finally { saving--; }
    };
    queue = queue.then(run);
    await queue;
  }
  async function update(path: string, value: unknown) {
    await save(async () => {
      if (path === 'category' && resource) {
        const category = value as ResourceData['category'];
        const patch: Record<string, unknown> = { 'system.category': category, 'system.resourceType': getTypeOptions(category)[0]?.value ?? '' };
        if (isResourceDefaultImage(item.img)) patch.img = getResourceImage(category);
        return item.update(patch);
      }
      if (path === 'slot' && equipment) {
        const patch: Record<string, unknown> = { 'system.slot': value };
        if (item.img === getEquipmentImage(equipment.slot)) patch.img = getEquipmentImage(value as EquipmentSystem['slot']);
        return item.update(patch);
      }
      return item.update({ [`system.${path}`]: value });
    });
  }
  async function changeType() {
    const next = pendingType;
    if (!next || !consumable) return;
    await save(async () => {
      const current = item.system as ConsumableData;
      const replacement = {
        ...ItemFactory.createConsumable(next, { name: item.name, description: current.description, weight: current.weight, rarity: current.rarity, baseId: current.baseId }),
        price: current.price, quantity: current.quantity, stackLimit: current.stackLimit,
        activation: { ...current.activation }, uses: { ...current.uses },
      };
      const patch: Record<string, unknown> = { system: replacement };
      if (item.img === getConsumableImage(current.consumableType)) patch.img = getConsumableImage(next);
      await item.update(patch, { recursive: false });
      pendingType = null;
    });
  }
  function requestType(value: string | number) {
    if (value !== consumable?.consumableType) pendingType = value as ConsumableType;
  }
  function imagePicker() {
    if (readonly || typeof FilePicker === 'undefined') return;
    new FilePicker({ type: 'image', current: item.img, callback: path => { void save(() => item.update({ img: path })); } }).browse();
  }
</script>

<div class="shw-item-v2" aria-busy={saving > 0}>
  <header class="item-sheet-header">
    <p class="item-brand">SHATTERED WORLDS / {t('itemUi.catalog')}</p>
    <div class="item-identity">
      <button type="button" class="item-image" aria-label={t('itemUi.editImage')} disabled={readonly} onclick={imagePicker}>
        {#if showImage}<img src={identity.img} alt="" />{:else}<i class="fas {icon}" aria-hidden="true"></i>{/if}
      </button>
      <div class="item-title-group"><label><span class="item-sr-only">{t('itemUi.itemName')}</span>
          <input class="item-title" value={identity.name} disabled={readonly} onchange={(e) => {
            const name = e.currentTarget.value.trim();
            if (name) void save(() => item.update({ name })); else e.currentTarget.value = item.name;
          }} /></label>
        <p>{category}</p>
      </div>
    </div>
  </header>
  {#if error}<div class="item-save-error" role="alert"><p>{error}</p><button type="button" disabled={saving > 0} onclick={() => retry?.()}>{t('itemUi.retry')}</button></div>{/if}
  {#if pendingType}<div class="item-type-confirm" role="dialog" tabindex="-1" aria-label={t('itemUi.changeType')}>
    <h2>{t('itemUi.changeType')}</h2><p>{t('itemUi.changeTypeHint')}</p>
    <div><button type="button" disabled={saving > 0} onclick={() => (pendingType = null)}>{t('newUi.cancel')}</button>
      <button type="button" class="item-primary" disabled={saving > 0} onclick={changeType}>{t('itemUi.confirmType')}</button></div>
  </div>{/if}
  <div class="item-sheet-layout">
    <main class="item-main">
      {#snippet description()}
      <section class="item-description"><label><span class="item-section-title">{t('item.description.title')}</span>
          <textarea disabled={readonly} value={system.description ?? ''} placeholder={t('item.description.placeholder')} rows="2"
            onchange={(e) => update('description', e.currentTarget.value)}></textarea></label></section>
      {/snippet}
      {#if !consumable || ['potion', 'food'].includes(consumable.consumableType)}{@render description()}{/if}
      {#if equipment}<EquipmentDetails system={equipment} {update} disabled={readonly || saving > 0} {linkedItems} />
      {:else if consumable}{#key consumable.consumableType}<ConsumableDetails system={consumable} {update} disabled={readonly || saving > 0} />{/key}
      {:else if resource}
        <section><div class="item-section-heading"><h2>{t('resource.header.typeLabel')}</h2></div>
          <ItemField label={t('resource.header.typeLabel')} value={resource.resourceType} suggestions={getTypeOptions(resource.category, resource.resourceType)} disabled={readonly} onChange={v => update('resourceType', v)} />
          <p class="item-hint">{t('itemUi.typeHint')}</p>
        </section>
        <section><div class="item-section-heading"><h2>{t('itemUi.stock')}</h2></div><div class="item-field-grid">
          <ItemField label={t('item.basicStats.quantity')} type="number" min={0} step={1} value={resource.quantity} disabled={readonly} onChange={v => update('quantity', v)} />
          <ItemField label={t('item.basicStats.stack')} type="number" min={1} step={1} value={resource.stackLimit} disabled={readonly} onChange={v => update('stackLimit', v)} />
        </div></section>
      {/if}
      {#if consumable && !['potion', 'food'].includes(consumable.consumableType)}{@render description()}{/if}
    </main>
    <aside class="item-properties" aria-label={t('itemUi.properties')}>
      <section><h2>{t('itemUi.properties')}</h2>
        {#if equipment}<ItemField label={t('equipment.header.slotLabel')} value={equipment.slot} options={EQUIPMENT_SLOTS} disabled={readonly} onChange={v => update('slot', v)} />
        {:else if consumable}<ItemField label={t('item.header.typeLabel')} value={consumable.consumableType} options={CONSUMABLE_TYPES} disabled={readonly || saving > 0} onChange={requestType} />
        {:else if resource}<ItemField label={t('resource.header.categoryLabel')} value={resource.category} options={getCategoryOptions()} disabled={readonly} onChange={v => update('category', v)} />{/if}
        <ItemField label={t('item.basicStats.rarity')} value={system.rarity} options={rarityOptions} disabled={readonly} onChange={v => update('rarity', v)} />
        {#if equipment}<ItemField label={t('equipment.stats.armorClass')} type="number" min={0} value={equipment.armorClass} disabled={readonly} onChange={v => update('armorClass', v)} />{/if}
        <ItemField label={t('item.basicStats.price')} type="number" min={0} value={system.price} disabled={readonly} onChange={v => update('price', v)} />
        <ItemField label={t('item.basicStats.weight')} type="number" min={0} value={system.weight} disabled={readonly} onChange={v => update('weight', v)} />
        {#if consumable}
          <ItemField label={t('item.basicStats.stack')} type="number" min={1} step={1} value={consumable.stackLimit} disabled={readonly} onChange={v => update('stackLimit', v)} />
        {/if}
      </section>
      {#if consumable}<section><h2>{t('itemUi.activation')}</h2><div class="item-activation-fields">
          <ItemField label={t('itemUi.action')} value={consumable.activation.type} options={ACTIVATION_TYPES} disabled={readonly} onChange={v => update('activation.type', v)} />
          <ItemField label={t('itemUi.cost')} type="number" min={0} step={1} value={consumable.activation.cost} disabled={readonly} onChange={v => update('activation.cost', v)} />
        </div></section>
        <section><h2>{t('itemUi.uses')}</h2><div class="item-uses-fields">
          <ItemField label={t('itemUi.remaining')} type="number" min={0} step={1} value={consumable.uses.value} disabled={readonly} onChange={v => update('uses.value', v)} />
          <span aria-hidden="true">/</span>
          <ItemField label={t('itemUi.maximum')} type="number" min={0} step={1} value={consumable.uses.max} disabled={readonly} onChange={v => update('uses.max', v)} />
          <ItemField label={t('itemUi.unit')} value={consumable.uses.per} options={PER_TYPES} disabled={readonly} onChange={v => update('uses.per', v)} />
        </div></section>
      {/if}
    </aside>
  </div>
  <footer class="item-sheet-footer"><span>{readonly ? t('itemUi.readonly') : t('itemUi.autoSave')}</span>
    <span role="status" aria-live="polite">{saving > 0 ? t('itemUi.saving') : ''}</span></footer>
</div>
