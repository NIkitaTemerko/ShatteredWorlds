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
    colors = {
      dark: 'var(--shw-color-primary, #8b4fc9)',
      light: 'var(--shw-glass-fill-tint, rgb(72 48 112 / 32%))',
    },
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
    box-sizing: border-box;
    background: color-mix(in srgb, var(--dark) 55%, #1c1828);
    color: var(--shw-color-text, #e8e4f0);
    padding: 0.4rem 0.65rem;
    font-weight: 700;
    font-size: 13px;
    font-family: var(--shw-font, inherit);
    text-align: left;
    border: 1px solid var(--shw-color-border-bright, #6e6488);
    border-bottom: none;
  }

  /* та же левая кромка, что у body / section-header */
  section :global(.stat-header) {
    text-align: left;
    padding-left: 0.65rem;
    padding-right: 0.65rem;
  }

  section :global(.stat-body) {
    padding-left: 0.65rem;
    padding-right: 0.65rem;
  }
</style>
