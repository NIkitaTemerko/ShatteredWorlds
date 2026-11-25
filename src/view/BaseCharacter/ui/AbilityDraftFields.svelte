<script lang="ts">
  import AbilityModifiers from './AbilityModifiers.svelte';
  import type { AbilitySystem } from '../../../documents/Item/types/AbilityDataTypes';
  import {
    ACTION_TYPES,
    RANGE_KINDS,
    TARGET_TYPES,
    PASSIVE_MODES,
  } from '../../AbilityItem/constants/abilityConstants';
  import { COMBAT_DAMAGE_TYPE_DEFINITIONS } from '../../../shared/model/damage/damageTypeConfig';
  import { t, type I18nKey } from '../../../shared/i18n';
  let { system = $bindable() }: { system: AbilitySystem } = $props();
</script>

<details class="ability-options">
  <summary>{t('newUi.applicationParameters')} ›</summary>
  <div class="item-edit-fields">
    {#if system.category === 'active'}
      <label class="form-field"
        >{t('ability.activeDetails.actionType')}<select bind:value={system.actionType}
          >{#each ACTION_TYPES as option}<option value={option.value}
              >{t(option.label as I18nKey)}</option
            >{/each}</select
        ></label
      >
      <label class="form-field"
        >{t('ability.advancedSettings.castTime')}<input
          type="number"
          min="0"
          bind:value={system.castTime}
        /></label
      >
      <label class="form-field"
        >{t('ability.activeDetails.rangeKind')}<select bind:value={system.range.kind}
          >{#each RANGE_KINDS as option}<option value={option.value}
              >{t(option.label as I18nKey)}</option
            >{/each}</select
        ></label
      >
      <label class="form-field"
        >{t('ability.activeDetails.rangeDistance')}<input
          type="number"
          min="0"
          bind:value={system.range.distance}
        /></label
      >
      {#if system.range.kind === 'area'}<label class="form-field"
          >{t('common.radius')}<input
            type="number"
            min="0"
            bind:value={system.range.radius}
          /></label
        >{/if}
      <label class="form-field"
        >{t('ability.activeDetails.targetType')}<select bind:value={system.targeting.targetType}
          >{#each TARGET_TYPES as option}<option value={option.value}
              >{t(option.label as I18nKey)}</option
            >{/each}</select
        ></label
      >
      <label class="form-field"
        >{t('newUi.maxTargets')}<input
          value={system.targeting.maxTargets ?? 1}
          onchange={(e) => {
            const value = e.currentTarget.value;
            system.targeting.maxTargets = value === 'all' ? 'all' : Math.max(1, Number(value) || 1);
          }}
        /></label
      >
    {:else}<label class="form-field"
        >{t('ability.passiveDetails.mode')}<select bind:value={system.mode}
          >{#each PASSIVE_MODES as option}<option value={option.value}
              >{t(option.label as I18nKey)}</option
            >{/each}</select
        ></label
      >{/if}
  </div>
</details>
<details class="ability-options">
  <summary>{t('newUi.effectsAndCosts')} ›</summary>
  <div class="item-edit-fields">
    {#if system.category === 'active'}
      {#each system.effects as effect, index}
        <div class="damage-step item-edit-fields">
          <label class="form-field"
            >{t('newUi.effect')}<select
              bind:value={effect.type}
              onchange={() => {
                if (effect.type === 'damage')
                  effect.damage ??= { formula: '1d6', damageType: 'physical' };
                if (effect.type === 'heal') effect.heal ??= { formula: '1d6' };
                if (effect.type === 'buff') effect.buff ??= { modifiers: [] };
                if (effect.type === 'debuff') effect.debuff ??= { modifiers: [] };
                if (effect.type === 'movement') effect.movement ??= { kind: 'dash', distance: 0 };
                if (effect.type === 'summon')
                  effect.summon ??= {
                    creatureId: '',
                    count: 1,
                    duration: { value: 1, unit: 'round' },
                  };
              }}
              >{#each ['damage', 'heal', 'buff', 'debuff', 'movement', 'summon', 'custom'] as kind}<option
                  value={kind}>{t(`newUi.effect_${kind}` as I18nKey)}</option
                >{/each}</select
            ></label
          >
          {#if effect.type === 'damage' && effect.damage}<label class="form-field"
              >{t('newUi.formula')}<input bind:value={effect.damage.formula} /></label
            >
            <label class="form-field"
              >{t('newUi.damageType')}<select bind:value={effect.damage.damageType}
                >{#each COMBAT_DAMAGE_TYPE_DEFINITIONS as type}<option value={type.id}
                    >{t(type.labelKey)}</option
                  >{/each}</select
              ></label
            >
          {:else if effect.type === 'heal' && effect.heal}<label class="form-field"
              >{t('newUi.formula')}<input bind:value={effect.heal.formula} /></label
            >{/if}
          {#if effect.type === 'buff' && effect.buff}<AbilityModifiers
              bind:block={effect.buff}
            />{/if}
          {#if effect.type === 'debuff' && effect.debuff}<AbilityModifiers
              bind:block={effect.debuff}
            />{/if}
          {#if effect.type === 'movement' && effect.movement}
            <label class="form-field"
              >{t('item.potionFood.effectType')}<select bind:value={effect.movement.kind}
                >{#each ['dash', 'teleport', 'push', 'pull'] as kind}<option value={kind}
                    >{t(`newUi.move_${kind}` as I18nKey)}</option
                  >{/each}</select
              ></label
            >
            <label class="form-field"
              >{t('ability.activeDetails.rangeDistance')}<input
                type="number"
                min="0"
                bind:value={effect.movement.distance}
              /></label
            >
          {/if}
          {#if effect.type === 'summon' && effect.summon}
            <label class="form-field"
              >{t('newUi.creatureId')}<input bind:value={effect.summon.creatureId} /></label
            >
            <label class="form-field"
              >{t('newUi.amount')}<input
                type="number"
                min="1"
                bind:value={effect.summon.count}
              /></label
            >
            <label class="form-field"
              >{t('common.duration')}<input
                type="number"
                min="0"
                bind:value={effect.summon.duration.value}
              /></label
            >
          {/if}
          <label class="form-field"
            >{t('item.description.title')}<textarea rows="2" bind:value={effect.descriptionOverride}
            ></textarea></label
          >
          <button
            type="button"
            class="danger-button"
            onclick={() => {
              if (system.category === 'active')
                system.effects = system.effects.filter((_, i) => i !== index);
            }}>{t('common.delete')}</button
          >
        </div>
      {/each}
      <button
        type="button"
        class="outline-button"
        onclick={() => {
          if (system.category === 'active')
            system.effects = [
              ...system.effects,
              { type: 'damage', damage: { formula: '1d6', damageType: 'physical' } },
            ];
        }}>+ {t('newUi.effect')}</button
      >
    {/if}
    {#if system.category === 'passive'}
      {#if system.statBonuses}<AbilityModifiers bind:block={system.statBonuses} />{:else}<button
          type="button"
          class="outline-button"
          onclick={() => {
            if (system.category === 'passive') system.statBonuses = { modifiers: [] };
          }}>+ {t('ability.passiveDetails.statBonuses')}</button
        >{/if}
    {/if}
    {#each system.resourceCosts ?? [] as cost, index}
      <div class="damage-step item-edit-fields">
        <label class="form-field"
          >{t('newUi.resource')}<select bind:value={cost.type}
            >{#each ['divinity', 'karma', 'mana', 'void', 'energy', 'stack'] as pool}<option
                value={pool}>{t(`newUi.resource_${pool}` as I18nKey)}</option
              >{/each}</select
          ></label
        >
        {#if cost.amount.kind === 'fixed'}<label class="form-field"
            >{t('newUi.amount')}<input
              type="number"
              min="0"
              bind:value={cost.amount.value}
            /></label
          >
        {:else}<label class="form-field"
            >{t('newUi.formula')}<input bind:value={cost.amount.formulaHint} /></label
          >{/if}
        <button
          type="button"
          class="danger-button"
          onclick={() =>
            (system.resourceCosts = system.resourceCosts?.filter((_, i) => i !== index))}
          >{t('common.delete')}</button
        >
      </div>
    {/each}
    <button
      type="button"
      class="outline-button"
      onclick={() =>
        (system.resourceCosts = [
          ...(system.resourceCosts ?? []),
          { type: 'mana', scope: 'actor', spendMode: 'spend', amount: { kind: 'fixed', value: 1 } },
        ])}>+ {t('newUi.resource')}</button
    >
  </div>
</details>
