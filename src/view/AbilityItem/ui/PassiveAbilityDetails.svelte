<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { PassiveAbilitySystem, StatModifierBlock } from "../../../documents/Item/types/AbilityDataTypes";
  import { StatsCard } from "../../../entities/consumable";
  import { StatBonusesEditor } from "../../../features/statBonuses";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { PASSIVE_MODES, AREA_SHAPES, AURA_AFFECTS } from "../constants/abilityConstants";

  interface Props {
    item: ShwItem;
    onUpdate: (path: string, value: any) => void;
  }

  let { item, onUpdate }: Props = $props();

  const system = $derived(item.system as PassiveAbilitySystem);

  function handleStatBonusesUpdate(statBonuses: StatModifierBlock) {
    onUpdate("statBonuses", statBonuses);
  }
</script>

{#if system.category === "passive"}
  <!-- MODE -->
  <section style="--dark: #2563EB; --light: #DBEAFE">
    <div class="section-header">{t("ability.passiveDetails.title")}</div>

    <StatsCard columns={1}>
      <div class="stat-col" style="--dark: #2563EB; --light: #DBEAFE">
        <div class="stat-header">{t("ability.passiveDetails.mode")}</div>
        <div class="stat-body">
          <SelectInput
            value={system.mode}
            options={PASSIVE_MODES}
            variant="underline"
            fullWidth
            onchange={(e) => onUpdate("mode", e.currentTarget.value)}
          />
        </div>
      </div>
    </StatsCard>
  </section>

  <!-- STAT BONUSES (for stat-bonus kind) -->
  {#if system.passiveKind === "stat-bonus"}
    <StatBonusesEditor
      statBonuses={system.statBonuses}
      onUpdate={handleStatBonusesUpdate}
      title={t("ability.passiveDetails.statBonuses")}
      subtitle={t("ability.passiveDetails.bonusesInfo")}
    />
  {/if}

  <!-- AURA (for aura kind) -->
  {#if system.passiveKind === "aura" && system.aura}
    <section style="--dark: #F59E0B; --light: #FEF3C7">
      <div class="section-header">{t("ability.passiveDetails.aura")}</div>

      <StatsCard columns={3}>
        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.passiveDetails.auraRadius")}</div>
          <div class="stat-body">
            <Input
              type="number"
              min="0"
              value={system.aura.radius}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => onUpdate("aura.radius", Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.passiveDetails.auraShape")}</div>
          <div class="stat-body">
            <SelectInput
              value={system.aura.shape}
              options={AREA_SHAPES}
              variant="underline"
              fullWidth
              onchange={(e) => onUpdate("aura.shape", e.currentTarget.value)}
            />
          </div>
        </div>

        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.passiveDetails.auraAffect")}</div>
          <div class="stat-body">
            <SelectInput
              value={system.aura.affect}
              options={AURA_AFFECTS}
              variant="underline"
              fullWidth
              onchange={(e) => onUpdate("aura.affect", e.currentTarget.value)}
            />
          </div>
        </div>
      </StatsCard>

      <StatsCard columns={2}>
        <div class="stat-col" style="--dark: #8B5CF6; --light: #EDE9FE">
          <div class="stat-header">{t("ability.passiveDetails.isToggle")}</div>
          <div class="stat-body">
            <input
              type="checkbox"
              checked={system.aura.isToggle}
              onchange={(e) => onUpdate("aura.isToggle", e.currentTarget.checked)}
              class="checkbox"
            />
          </div>
        </div>

        <div class="stat-col" style="--dark: #8B5CF6; --light: #EDE9FE">
          <div class="stat-header">{t("ability.passiveDetails.requiresConcentration")}</div>
          <div class="stat-body">
            <input
              type="checkbox"
              checked={system.aura.requiresConcentration}
              onchange={(e) => onUpdate("aura.requiresConcentration", e.currentTarget.checked)}
              class="checkbox"
            />
          </div>
        </div>
      </StatsCard>
    </section>
  {/if}

  <!-- TRIGGERS (for triggered kind) -->
  {#if system.passiveKind === "triggered"}
    <section style="--dark: #DC2626; --light: #FEE2E2">
      <div class="section-header">{t("ability.passiveDetails.triggers")}</div>

      <StatsCard columns={1}>
        <div class="stat-col full" style="--dark: #DC2626; --light: #FEE2E2">
          <div class="stat-header">{t("ability.passiveDetails.triggerInfo")}</div>
          <div class="stat-body">
            <span style="font-size: 12px; opacity: 0.8;">
              {t("ability.passiveDetails.triggerPlaceholder")}
            </span>
          </div>
        </div>
      </StatsCard>
    </section>
  {/if}
{/if}

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

  .checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>
