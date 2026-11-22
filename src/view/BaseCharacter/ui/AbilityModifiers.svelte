<script lang="ts">
  import type { StatModifierBlock } from '../../../documents/Item/types/AbilityDataTypes';
  import { t } from '../../../shared/i18n';
  let { block = $bindable() }: { block: StatModifierBlock } = $props();
</script>

{#each block.modifiers as modifier, index}
  <div class="item-edit-fields damage-step">
    <label class="form-field">{t('newUi.parameter')}<input bind:value={modifier.stat} /></label>
    <label class="form-field"
      >{t('newUi.operation')}<select bind:value={modifier.mode}
        ><option value="add">+</option><option value="mul">×</option><option value="override"
          >=</option
        ></select
      ></label
    >
    <label class="form-field"
      >{t('newUi.amount')}<input type="number" bind:value={modifier.value} /></label
    >
    <label class="form-field">{t('newUi.condition')}<input bind:value={modifier.condition} /></label
    >
    <button
      type="button"
      class="danger-button"
      onclick={() => (block.modifiers = block.modifiers.filter((_, i) => i !== index))}
      >{t('newUi.delete')}</button
    >
  </div>
{/each}
<button
  type="button"
  class="outline-button"
  onclick={() => (block.modifiers = [...block.modifiers, { stat: 'attributes.force.extra', mode: 'add', value: 0 }])}
  >+ {t('newUi.parameter')}</button
>
