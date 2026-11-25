<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { getActorCombatState, previewDamageSequence } from '../../../shared/helpers/damage';
  import {
    COMBAT_DAMAGE_TYPE_DEFINITIONS,
    getDamageTypeDefinition,
    damageTypeHitsArmor,
  } from '../../../shared/model/damage/damageTypeConfig';
  import type { DamageEntry } from '../../../shared/model/damage/types';
  import { t } from '../../../shared/i18n';
  let { actor, onApplied }: { actor: ShwActor; onApplied: () => void } = $props();
  let nextId = 0;
  const createRow = (): DamageEntry => ({
    id: `damage-${nextId++}`,
    type: 'physical',
    amount: 0,
    penetration: 0,
    fallHeight: 0,
  });
  let rows = $state<DamageEntry[]>([createRow()]);
  let oneTimeBarrier = $state(0);
  let dragged = $state<string | null>(null);
  let busy = $state(false);
  let error = $state('');
  const nonnegative = (n: number | undefined) => Math.max(0, Number.isFinite(n) ? n! : 0);
  const combatState = $derived(getActorCombatState(actor));
  const result = $derived(
    previewDamageSequence(
      rows.map((row) => ({
        ...row,
        amount: nonnegative(row.amount),
        fallHeight: nonnegative(row.fallHeight),
        penetration: damageTypeHitsArmor(getDamageTypeDefinition(row.type))
          ? nonnegative(row.penetration)
          : 0,
      })),
      combatState,
      { oneTimeBarrier: nonnegative(oneTimeBarrier) },
    ),
  );
  const canApply = $derived(
    result.healthLost > 0 || result.barrierLost > 0 || result.oneTimeBarrierLost > 0,
  );
  function move(id: string, target: number) {
    const source = rows.findIndex((row) => row.id === id);
    if (source < 0 || target < 0 || target >= rows.length) return;
    const reordered = [...rows];
    const [row] = reordered.splice(source, 1);
    reordered.splice(target, 0, row);
    rows = reordered;
  }
  async function apply() {
    if (busy || !canApply) return;
    busy = true;
    error = '';
    try {
      await actor.update({
        'system.health.value': result.finalHealth,
        'system.barrier.value': result.finalBarrier,
      });
      onApplied();
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }
</script>

<div class="damage-calculator">
  <p class="muted">
    {t('newUi.hp')}
    {combatState.health} / {actor.system.totals.health} · {t('additionalAttributes.barrier')}
    {combatState.barrier}
  </p>
  <div class="damage-entry-list">
    {#each rows as row, index (row.id)}
      {@const definition = getDamageTypeDefinition(row.type)}
      <div
        class="damage-entry"
        role="group"
        aria-label={`${t('newUi.damageRow')} ${index + 1}`}
        ondragover={(e) => {
          if (dragged) e.preventDefault();
        }}
        ondrop={(e) => {
          e.preventDefault();
          if (dragged) move(dragged, index);
          dragged = null;
        }}
      >
        <button
          type="button"
          class="damage-drag"
          draggable="true"
          aria-label={t('newUi.reorderDamage')}
          ondragstart={(e) => {
            dragged = row.id;
            e.dataTransfer?.setData('text/plain', row.id);
          }}
          ondragend={() => (dragged = null)}
          onkeydown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              move(row.id, index + (e.key === 'ArrowUp' ? -1 : 1));
            }
          }}>⠿</button
        >
        <label class="form-field"
          >{t('newUi.damageType')}<select bind:value={row.type}
            >{#each COMBAT_DAMAGE_TYPE_DEFINITIONS as type}<option value={type.id}
                >{t(type.labelKey)}</option
              >{/each}</select
          ></label
        >
        <label class="form-field"
          >{t(definition.inputKind === 'fallHeight' ? 'newUi.fallHeight' : 'newUi.damageAmount')}
          {#if definition.inputKind === 'fallHeight'}<input
              type="number"
              min="0"
              bind:value={row.fallHeight}
            />{:else}<input type="number" min="0" bind:value={row.amount} />{/if}
        </label>
        <button
          type="button"
          class="icon-button damage-remove"
          aria-label={t('newUi.removeDamage')}
          onclick={() => (rows = rows.filter((r) => r.id !== row.id))}>×</button
        >
        {#if damageTypeHitsArmor(definition)}<label class="damage-penetration"
            >{t('character.damage.penetration')}<input
              type="number"
              min="0"
              bind:value={row.penetration}
            /></label
          >{/if}
        {#if row.type === 'fall'}<p class="muted damage-penetration">
            {t('newUi.massShort')}: {combatState.massCategory}
          </p>{/if}
      </div>
    {/each}
  </div>
  <div class="damage-barrier">
    <label class="form-field"
      >{t('character.damage.oneTimeBarrier')}<input
        type="number"
        min="0"
        bind:value={oneTimeBarrier}
      /></label
    ><span class="muted">{t('newUi.oneSequenceOnly')}</span>
  </div>
  <button
    type="button"
    class="outline-button damage-add"
    onclick={() => (rows = [...rows, createRow()])}>+ {t('newUi.addDamageRow')}</button
  >
  <h2>{t('newUi.hp')}: {combatState.health} → {result.finalHealth}</h2>
  <details class="calculation-details">
    <summary>{t('newUi.howCalculated')} ›</summary>
    {#each result.entries as entry}
      <div class="damage-step">
        <strong
          >{entry.order}. {t(getDamageTypeDefinition(entry.type).labelKey)} · {entry.raw}</strong
        >
        <p>
          {t('additionalAttributes.barrier')}: −{entry.barrierAbsorbed} · {t('character.damage.oneTimeBarrier')}: −{entry.oneTimeBarrierAbsorbed}
        </p>
        {#each entry.defenseSteps as step}<p>
            {t(
              step.layer === 'armorClass'
                ? 'newUi.armorDefense'
                : step.layer === 'psiDefense'
                  ? 'newUi.psiDefense'
                  : 'newUi.absorptionShort',
            )}: {step.effectiveStat ?? step.stat} → −{step.blocked}
          </p>{/each}
        <p>{t('newUi.hp')}: −{entry.hpDamage} → {entry.healthAfter}</p>
      </div>
    {/each}
  </details>
  {#if error}<p role="alert">{error}</p>{/if}
  <button type="button" class="primary wide" disabled={busy || !canApply} onclick={apply}
    >{t('newUi.applyDamage')}{#if canApply}: −{combatState.health - result.finalHealth}
      {t('newUi.hp')}, −{result.barrierLost}
      {t('additionalAttributes.barrier')}{/if}</button
  >
</div>
