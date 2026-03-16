<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { ActiveAbilitySystem } from "../../../documents/Item/types/AbilityDataTypes";
  import { StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";
  import { ACTION_TYPES, RANGE_KINDS, AREA_SHAPES, TARGET_TYPES } from "../constants/abilityConstants";

  interface Props {
    item: ShwItem;
    onUpdate: (path: string, value: any) => void;
  }

  let { item, onUpdate }: Props = $props();

  const system = $derived(item.system as ActiveAbilitySystem);
</script>

{#if system.category === "active"}
  <!-- ACTION & TIMING -->
  <section style="--dark: #DC2626; --light: #FEE2E2">
    <div class="section-header">{t("ability.activeDetails.title")}</div>

    <StatsCard columns={2}>
      <div class="stat-col" style="--dark: #DC2626; --light: #FEE2E2">
        <div class="stat-header">{t("ability.activeDetails.actionType")}</div>
        <div class="stat-body">
          <SelectInput
            value={system.actionType}
            options={ACTION_TYPES}
            variant="underline"
            fullWidth
            onchange={(e) => onUpdate("actionType", e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #10B981; --light: #D1FAE5">
        <div class="stat-header">{t("ability.advancedSettings.castTime")}</div>
        <div class="stat-body">
          <Input
            type="number"
            min="0"
            value={system.range.radius ?? 0}
            variant="underline"
            textAlign="center"
            fullWidth
            onchange={(e) => onUpdate("range.radius", Number(e.currentTarget.value))}
          />
        </div>
      </div>
    </StatsCard>
  </section>

  <!-- RANGE & TARGETING -->
  <section style="--dark: #F59E0B; --light: #FEF3C7">
    <div class="section-header">{t("ability.activeDetails.range")}</div>

    <StatsCard columns={3}>
      <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
        <div class="stat-header">{t("ability.activeDetails.rangeKind")}</div>
        <div class="stat-body">
          <SelectInput
            value={system.range.kind}
            options={RANGE_KINDS}
            variant="underline"
            fullWidth
            onchange={(e) => onUpdate("range.kind", e.currentTarget.value)}
          />
        </div>
      </div>

      {#if system.range.kind !== "self" && system.range.kind !== "area"}
        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.activeDetails.rangeDistance")}</div>
          <div class="stat-body">
            <Input
              type="number"
              min="0"
              value={system.range.distance ?? 0}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => onUpdate("range.distance", Number(e.currentTarget.value))}
            />
          </div>
        </div>
      {/if}

      {#if system.range.kind === "area"}
        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.activeDetails.areaRadius")}</div>
          <div class="stat-body">
            <Input
              type="number"
              min="0"
              value={system.range.radius ?? 0}
              variant="underline"
              textAlign="center"
              fullWidth
              onchange={(e) => onUpdate("range.radius", Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
          <div class="stat-header">{t("ability.activeDetails.areaShape")}</div>
          <div class="stat-body">
            <SelectInput
              value={system.range.shape || "circle"}
              options={AREA_SHAPES}
              variant="underline"
              fullWidth
              onchange={(e) => onUpdate("range.shape", e.currentTarget.value)}
            />
          </div>
        </div>
      {/if}
    </StatsCard>

    <StatsCard columns={3}>
      <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
        <div class="stat-header">{t("ability.activeDetails.targetType")}</div>
        <div class="stat-body">
          <SelectInput
            value={system.targeting.targetType}
            options={TARGET_TYPES}
            variant="underline"
            fullWidth
            onchange={(e) => onUpdate("targeting.targetType", e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
        <div class="stat-header">{t("ability.activeDetails.maxTargets")}</div>
        <div class="stat-body">
          <Input
            type="number"
            min="1"
            value={typeof system.targeting.maxTargets === "number" ? system.targeting.maxTargets : ""}
            variant="underline"
            textAlign="center"
            fullWidth
            placeholder="all"
            onchange={(e) => {
              const val = e.currentTarget.value;
              onUpdate("targeting.maxTargets", val === "" ? "all" : Number(val));
            }}
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
        <div class="stat-header">{t("ability.advancedSettings.requiresLOS")}</div>
        <div class="stat-body">
          <input
            type="checkbox"
            checked={system.targeting.requiresLineOfSight}
            onchange={(e) => onUpdate("targeting.requiresLineOfSight", e.currentTarget.checked)}
            class="checkbox"
          />
        </div>
      </div>
    </StatsCard>
  </section>

  <!-- USES & TOGGLES -->
  <section style="--dark: #8B5CF6; --light: #EDE9FE">
    <div class="section-header">{t("ability.advancedSettings.uses")}</div>

    <StatsCard columns={2}>
      <div class="stat-col" style="--dark: #EC4899; --light: #FCE7F3">
        <div class="stat-header">{t("ability.advancedSettings.usesPerRest")}</div>
        <div class="stat-body">
          <Input
            type="number"
            min="0"
            value={system.usesPerRest ?? ""}
            variant="underline"
            textAlign="center"
            fullWidth
            placeholder="∞"
            onchange={(e) => {
              const val = e.currentTarget.value;
              onUpdate("usesPerRest", val === "" ? null : Number(val));
            }}
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #EC4899; --light: #FCE7F3">
        <div class="stat-header">{t("ability.advancedSettings.usesPerEncounter")}</div>
        <div class="stat-body">
          <Input
            type="number"
            min="0"
            value={system.usesPerEncounter ?? ""}
            variant="underline"
            textAlign="center"
            fullWidth
            placeholder="∞"
            onchange={(e) => {
              const val = e.currentTarget.value;
              onUpdate("usesPerEncounter", val === "" ? null : Number(val));
            }}
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #8B5CF6; --light: #EDE9FE">
        <div class="stat-header">{t("ability.advancedSettings.channeled")}</div>
        <div class="stat-body">
          <input
            type="checkbox"
            checked={system.channeled}
            onchange={(e) => onUpdate("channeled", e.currentTarget.checked)}
            class="checkbox"
          />
        </div>
      </div>

      <div class="stat-col" style="--dark: #8B5CF6; --light: #EDE9FE">
        <div class="stat-header">{t("ability.advancedSettings.togglable")}</div>
        <div class="stat-body">
          <input
            type="checkbox"
            checked={system.togglable}
            onchange={(e) => onUpdate("togglable", e.currentTarget.checked)}
            class="checkbox"
          />
        </div>
      </div>
    </StatsCard>
  </section>
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
