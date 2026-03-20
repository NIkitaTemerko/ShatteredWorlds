<script lang="ts">
  import type { StatModifier, StatModifierBlock } from "../../../documents/Item/types/AbilityDataTypes";
  import type { CharacterStatPath } from "../../../shared/model/characterStatPaths";
  import { StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { BonusCharacteristics } from "../../../shared/ui";

  interface Props {
    /** Текущий блок модификаторов (или null/undefined) */
    statBonuses: StatModifierBlock | null | undefined;
    /** Коллбэк обновления всего блока statBonuses */
    onUpdate: (statBonuses: StatModifierBlock) => void;
    /** Заголовок секции */
    title?: string;
    /** Заголовок внутренней карточки */
    subtitle?: string;
    /** Цвета секции */
    colors?: { dark: string; light: string };
  }

  let {
    statBonuses,
    onUpdate,
    title = t("ability.passiveDetails.statBonuses"),
    subtitle = t("ability.passiveDetails.bonusesInfo"),
    colors = { dark: "#10B981", light: "#D1FAE5" },
  }: Props = $props();

  const modifiers = $derived(statBonuses?.modifiers ?? []);

  function handleAdd(stat: CharacterStatPath) {
    const newModifier: StatModifier = {
      stat,
      mode: "add",
      value: 0,
      scaling: null,
      condition: undefined,
    };
    onUpdate({ modifiers: [...modifiers, newModifier] });
  }

  function handleRemove(index: number) {
    onUpdate({ modifiers: modifiers.filter((_, i) => i !== index) });
  }

  function handleUpdateValue(index: number, value: number) {
    onUpdate({ modifiers: modifiers.map((mod, i) => (i === index ? { ...mod, value } : mod)) });
  }

  function handleUpdateMode(index: number, mode: "add" | "mul" | "override") {
    onUpdate({ modifiers: modifiers.map((mod, i) => (i === index ? { ...mod, mode } : mod)) });
  }
</script>

<section style="--dark: {colors.dark}; --light: {colors.light}">
  <div class="section-header">{title}</div>

  <StatsCard columns={1}>
    <div class="stat-col full" style="--dark: {colors.dark}; --light: {colors.light}">
      <div class="stat-header">{subtitle}</div>
      <div class="stat-body full-width">
        <BonusCharacteristics
          {modifiers}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onUpdateValue={handleUpdateValue}
          onUpdateMode={handleUpdateMode}
        />
      </div>
    </div>
  </StatsCard>
</section>

<style>
  section {
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-header {
    background: var(--dark);
    color: #000;
    padding: 0.35rem 0.5rem;
    font-weight: 700;
    font-size: var(--font-size-14);
  }

  :global(.full-width) {
    width: 100%;
  }

  :global(.full-width .bonus-characteristics) {
    width: 100%;
  }
</style>
