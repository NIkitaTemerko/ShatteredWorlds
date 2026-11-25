<script lang="ts">
  import type { ConsumableData } from '../../../documents/Item/types/ConsumableDataTypes';
  import { APPLICATION_TYPES, SAVE_TYPES, DAMAGE_TYPES } from '../../../entities/consumable/model';
  import { t, resolveLabel } from '../../../shared/i18n';
  import ItemField from './ItemField.svelte';
  let { system, update, disabled }: { system: ConsumableData; update: (path: string, value: unknown) => Promise<void>; disabled: boolean } = $props();
  let openIndex = $state<number | null>(0);
  const effectTypes = [
    { value: 'heal', label: 'consumable.effectType.heal' },
    { value: 'buff', label: 'consumable.effectType.buff' },
    { value: 'cure', label: 'itemUi.cure' },
  ];
  const summary = $derived.by(() => {
    if (system.consumableType === 'potion') {
      const heal = system.effects.find(effect => effect.type === 'heal');
      return heal ? { title: t('itemUi.primaryEffect'), value: `${heal.amount} ${t('newUi.hp')}`, hint: `${t('consumable.effectType.heal')} · ${heal.duration === 0 ? t('itemUi.instant') : heal.duration}`, color: 'healing' } : null;
    }
    if (system.consumableType === 'bomb') return { title: t('itemUi.areaDamage'), value: String(system.damage.amount), hint: `${resolveLabel(DAMAGE_TYPES.find(type => type.value === system.damage.type)?.label ?? system.damage.type)} · ${t('common.radius')} ${system.radius}`, color: '' };
    if (system.consumableType === 'poison') return { title: t('itemUi.poisonDamage'), value: `${system.damage.initial} → ${system.damage.recurring}`, hint: t('itemUi.initialRecurring'), color: 'poison' };
    if (system.consumableType === 'scroll') return { title: t('newUi.spells'), value: system.spell.name || '—', hint: `${t('character.utility.level')}: ${system.spell.level} · ${system.spell.school || '—'}`, color: 'spell' };
    return null;
  });
  async function addEffect() {
    if (system.consumableType !== 'potion' && system.consumableType !== 'food') return;
    openIndex = system.effects.length;
    await update('effects', [...system.effects, system.consumableType === 'potion' ? { type: 'heal', amount: 0, duration: 0, attribute: '' } : { type: 'buff', value: 0, duration: 1 }]);
  }
  async function changeEffect(index: number, key: string, value: unknown) {
    if (system.consumableType === 'potion' || system.consumableType === 'food')
      await update('effects', system.effects.map((effect, i) => i === index ? { ...effect, [key]: value } : effect));
  }
  async function removeEffect(index: number) {
    if (system.consumableType !== 'potion' && system.consumableType !== 'food') return;
    await update('effects', system.effects.filter((_, i) => i !== index));
    if (openIndex === index) openIndex = null;
    else if (openIndex !== null && openIndex > index) openIndex--;
  }
</script>

{#if summary}<div class="item-mechanic-summary" class:healing={summary.color === 'healing'} class:poison={summary.color === 'poison'} class:spell={summary.color === 'spell'}>
  <span>{summary.title}</span><strong class="item-number">{summary.value}</strong><small>{summary.hint}</small>
</div>{/if}

{#if system.consumableType === 'bomb'}
  <section><div class="item-section-heading"><h2>{t('itemUi.explosion')}</h2></div><div class="item-field-grid">
    <ItemField label={t('item.bomb.damageType')} value={system.damage.type} options={DAMAGE_TYPES} {disabled} onChange={v => update('damage.type', v)} />
    <ItemField label={t('newUi.damageAmount')} value={system.damage.amount} type="number" min={0} {disabled} onChange={v => update('damage.amount', v)} />
    <ItemField label={t('common.radius')} value={system.radius} type="number" min={0} {disabled} onChange={v => update('radius', v)} />
    <ItemField label={t('common.difficulty')} value={system.save.dc} type="number" min={0} {disabled} onChange={v => update('save.dc', v)} />
    <ItemField label={t('item.bomb.save')} value={system.save.type} options={SAVE_TYPES} {disabled} onChange={v => update('save.type', v)} />
  </div></section>
{:else if system.consumableType === 'poison'}
  <section><div class="item-section-heading"><h2>{t('itemUi.poisonParameters')}</h2></div><div class="item-field-grid">
    <ItemField label={t('item.poison.initialDamage')} value={system.damage.initial} {disabled} onChange={v => update('damage.initial', v)} />
    <ItemField label={t('item.poison.repeatDamage')} value={system.damage.recurring} {disabled} onChange={v => update('damage.recurring', v)} />
    <ItemField label={t('common.duration')} value={system.damage.duration} type="number" min={0} {disabled} onChange={v => update('damage.duration', v)} />
    <ItemField label={t('item.poison.application')} value={system.application} options={APPLICATION_TYPES} {disabled} onChange={v => update('application', v)} />
    <ItemField label={t('item.bomb.save')} value={system.save.type} options={SAVE_TYPES} {disabled} onChange={v => update('save.type', v)} />
    <ItemField label={t('common.difficulty')} value={system.save.dc} type="number" min={0} {disabled} onChange={v => update('save.dc', v)} />
  </div></section>
{:else if system.consumableType === 'scroll'}
  <section><div class="item-section-heading"><h2>{t('newUi.spells')}</h2></div><div class="item-field-grid">
    <div class="item-full-width"><ItemField label={t('spell.header.namePlaceholder')} value={system.spell.name} {disabled} onChange={v => update('spell.name', v)} /></div>
    <ItemField label={t('character.utility.level')} value={system.spell.level} type="number" min={0} {disabled} onChange={v => update('spell.level', v)} />
    <ItemField label={t('item.scroll.school')} value={system.spell.school} {disabled} onChange={v => update('spell.school', v)} />
  </div></section>
  <section><div class="item-section-heading"><h2>{t('itemUi.requirements')}</h2></div><div class="item-field-grid">
    <ItemField label={t('item.scroll.requiredAttribute')} value={system.requirements.ability} {disabled} onChange={v => update('requirements.ability', v)} />
    <ItemField label={t('common.difficulty')} value={system.requirements.dc} type="number" min={0} {disabled} onChange={v => update('requirements.dc', v)} />
  </div></section>
{/if}

{#if system.consumableType === 'food'}
  <section><div class="item-section-heading"><h2>{t('item.potionFood.nutritionTitle')}</h2></div><div class="item-field-grid">
    <ItemField label={t('item.potionFood.saturationStrength')} type="number" min={0} value={system.nutrition.value} {disabled} onChange={v => update('nutrition.value', v)} />
    <ItemField label={t('item.potionFood.saturationDuration')} type="number" min={0} value={system.nutrition.duration} {disabled} onChange={v => update('nutrition.duration', v)} />
  </div></section>
{/if}

{#if system.consumableType === 'potion' || system.consumableType === 'food'}
  <section class="item-effects"><div class="item-section-heading"><h2>{t('item.potionFood.effectsTitle')}</h2>
    <button type="button" class="item-text-action" {disabled} onclick={addEffect}>+ {t('itemUi.addEffect')}</button></div>
    {#if !system.effects.length}<div class="item-empty">{t('itemUi.noEffects')}</div>{/if}
    {#each system.effects as effect, index}
      <div class="item-expandable" class:is-open={openIndex === index}>
        <div class="item-effect-heading"><button type="button" class="item-expand" aria-expanded={openIndex === index} onclick={() => (openIndex = openIndex === index ? null : index)}>
          <span class="item-chevron" aria-hidden="true"><i class={openIndex === index ? 'fas fa-chevron-down' : 'fas fa-chevron-right'}></i></span><span>{resolveLabel(effectTypes.find(type => type.value === effect.type)?.label ?? effect.type)}</span>
          <strong class="item-number">{'amount' in effect ? effect.amount : effect.value}</strong></button>
          <button type="button" class="item-remove" {disabled} aria-label={t('itemUi.removeEffect')} onclick={() => removeEffect(index)}>×</button></div>
        {#if openIndex === index}<div class="item-effect-fields item-field-grid">
          <ItemField label={t('item.potionFood.effectType')} value={effect.type} options={system.consumableType === 'potion' ? effectTypes : undefined} {disabled} onChange={v => changeEffect(index, 'type', v)} />
          <ItemField label={t('item.potionFood.effectStrength')} value={'amount' in effect ? effect.amount : effect.value} type="number" min={0} {disabled} onChange={v => changeEffect(index, system.consumableType === 'potion' ? 'amount' : 'value', v)} />
          <ItemField label={t('common.duration')} value={effect.duration} type="number" min={0} {disabled} onChange={v => changeEffect(index, 'duration', v)} />
          {#if system.consumableType === 'potion'}<ItemField label={t('item.potionFood.effectAttribute')} value={'attribute' in effect ? effect.attribute : ''} {disabled} onChange={v => changeEffect(index, 'attribute', v)} />{/if}
        </div>{/if}
      </div>
    {/each}
  </section>
{/if}
