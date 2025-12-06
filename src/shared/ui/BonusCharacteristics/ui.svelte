<script lang="ts">
  import type { StatModifier } from "../../../documents/Item/types/AbilityDataTypes";
  import type { CharacterStatPath } from "../../model/characterStatPaths";
  import type { I18nKey } from "../../i18n";
  import { CHARACTER_STAT_OPTIONS } from "../../model/characterStatPaths";
  import { localize, t } from "../../i18n";
  import ActionIcon from "../ActionIcon/ui.svelte";
  import SelectInput from "../SelectInput/ui.svelte";
  import Input from "../Input/ui.svelte";

  interface Props {
    modifiers: StatModifier[];
    onAdd: (stat: CharacterStatPath) => void;
    onRemove: (index: number) => void;
    onUpdateValue: (index: number, value: number) => void;
    onUpdateMode: (index: number, mode: "add" | "mul" | "override") => void;
  }

  let { modifiers, onAdd, onRemove, onUpdateValue, onUpdateMode }: Props = $props();

  // Получить список уже использованных характеристик
  const usedStats = $derived(new Set(modifiers.map((m) => m.stat)));

  // Фильтрация доступных опций (исключаем уже добавленные)
  const availableOptions = $derived(CHARACTER_STAT_OPTIONS.filter((opt) => !usedStats.has(opt.value)));

  // Проверка, можно ли добавить новую характеристику
  const canAdd = $derived(availableOptions.length > 0);

  // Состояние для селекта - выбираем первый доступный
  let selectedStat = $state<CharacterStatPath>("attributes.fortune.value");

  // Обновляем selectedStat когда меняется список доступных
  $effect(() => {
    if (availableOptions.length > 0) {
      const isCurrentValid = availableOptions.find((opt) => opt.value === selectedStat);
      if (!isCurrentValid) {
        selectedStat = availableOptions[0].value;
      }
    }
  });

  function handleAdd() {
    if (canAdd && selectedStat) {
      onAdd(selectedStat);
    }
  }

  // Получить label для характеристики с интерполяцией
  function getStatLabel(stat: string): string {
    const option = CHARACTER_STAT_OPTIONS.find((opt) => opt.value === stat);
    if (!option) return stat;

    // Если есть attributeKey, подставляем название атрибута через localize
    if (option.attributeKey) {
      return localize(option.labelKey, { attribute: t(option.attributeKey) });
    }

    return t(option.labelKey);
  }
</script>

<div class="bonus-characteristics">
  <!-- Форма добавления новой характеристики (всегда сверху) -->
  {#if canAdd}
    <div class="add-modifier">
      <div class="select-wrapper">
        <SelectInput
          value={selectedStat}
          options={availableOptions.map((opt) => ({
            value: opt.value,
            label: opt.attributeKey ? localize(opt.labelKey, { attribute: t(opt.attributeKey) }) : t(opt.labelKey),
          }))}
          variant="underline"
          fullWidth
          onchange={(e) => (selectedStat = e.currentTarget.value as CharacterStatPath)}
        />
      </div>

      <ActionIcon variant="default" size="md" onclick={handleAdd}>
        {#snippet icon()}
          <i class="fas fa-plus"></i>
        {/snippet}
      </ActionIcon>
    </div>
  {:else}
    <div class="no-stats-available">
      {t("ability.passiveDetails.allStatsAdded")}
    </div>
  {/if}

  <!-- Список уже добавленных характеристик -->
  {#if modifiers.length > 0}
    <div class="modifiers-list">
      {#each modifiers as modifier, index}
        <div class="modifier-row">
          <div class="modifier-stat">{getStatLabel(modifier.stat)}</div>

          <div class="modifier-mode">
            <SelectInput
              value={modifier.mode}
              options={[
                { value: "add", label: "ability.modifier.add" },
                { value: "mul", label: "ability.modifier.mul" },
                { value: "override", label: "ability.modifier.override" },
              ]}
              variant="underline"
              fullWidth
              onchange={(e) => onUpdateMode(index, e.currentTarget.value as "add" | "mul" | "override")}
            />
          </div>

          <div class="modifier-value">
            <Input
              type="number"
              value={modifier.value}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => onUpdateValue(index, Number(e.currentTarget.value))}
            />
          </div>

          <div class="modifier-actions">
            <ActionIcon variant="ghost" size="sm" onclick={() => onRemove(index)}>
              {#snippet icon()}
                <i class="fas fa-times"></i>
              {/snippet}
            </ActionIcon>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .bonus-characteristics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .modifiers-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .modifier-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0;
  }

  .modifier-stat {
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .modifier-mode,
  .modifier-value {
    display: flex;
  }

  .modifier-actions {
    display: flex;
    align-items: center;
  }

  .add-modifier {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.25rem 0;
  }

  .select-wrapper {
    flex: 1;
  }

  .no-stats-available {
    font-size: 12px;
    opacity: 0.7;
    text-align: center;
    padding: 0.5rem;
  }
</style>
