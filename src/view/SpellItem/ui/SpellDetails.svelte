<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import type { SpellSystem } from "../../../documents/Item/types/SpellDataTypes";
  import { StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";
  import { Input, SelectInput } from "../../../shared/ui";

  interface Props {
    item: ShwItem;
    onUpdate: (path: string, value: any) => void;
  }

  let { item, onUpdate }: Props = $props();

  const system = $derived(item.system as SpellSystem);
</script>

<!-- ACTION & TIMING -->
<section style="--dark: #DC2626; --light: #FEE2E2">
  <div class="section-header">{t("spell.details.title")}</div>

  <StatsCard columns={2}>
    <div class="stat-col" style="--dark: #DC2626; --light: #FEE2E2">
      <div class="stat-header">{t("spell.actionType.label")}</div>
      <div class="stat-body">
        <SelectInput
          value={system.actionType}
          options={[
            { value: "action", label: "spell.actionType.action" },
            { value: "bonus", label: "spell.actionType.bonus" },
            { value: "reaction", label: "spell.actionType.reaction" },
            { value: "free", label: "spell.actionType.free" },
          ]}
          variant="underline"
          fullWidth
          onchange={(e) => onUpdate("actionType", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col" style="--dark: #10B981; --light: #D1FAE5">
      <div class="stat-header">{t("spell.castTime")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={system.castTime ?? 0}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => onUpdate("castTime", Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>
</section>

<!-- RANGE & TARGETING -->
<section style="--dark: #F59E0B; --light: #FEF3C7">
  <div class="section-header">{t("spell.range.title")}</div>

  <StatsCard columns={3}>
    <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
      <div class="stat-header">{t("spell.rangeKind.label")}</div>
      <div class="stat-body">
        <SelectInput
          value={system.range.kind}
          options={[
            { value: "self", label: "spell.rangeKind.self" },
            { value: "melee", label: "spell.rangeKind.melee" },
            { value: "ranged", label: "spell.rangeKind.ranged" },
            { value: "area", label: "spell.rangeKind.area" },
          ]}
          variant="underline"
          fullWidth
          onchange={(e) => onUpdate("range.kind", e.currentTarget.value)}
        />
      </div>
    </div>

    {#if system.range.kind !== "self" && system.range.kind !== "area"}
      <div class="stat-col" style="--dark: #F59E0B; --light: #FEF3C7">
        <div class="stat-header">{t("spell.range.distance")}</div>
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
        <div class="stat-header">{t("spell.range.radius")}</div>
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
        <div class="stat-header">{t("spell.range.shape")}</div>
        <div class="stat-body">
          <SelectInput
            value={system.range.shape || "circle"}
            options={[
              { value: "circle", label: "spell.range.shapeCircle" },
              { value: "cone", label: "spell.range.shapeCone" },
              { value: "line", label: "spell.range.shapeLine" },
            ]}
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
      <div class="stat-header">{t("spell.targetType.label")}</div>
      <div class="stat-body">
        <SelectInput
          value={system.targeting.targetType}
          options={[
            { value: "self", label: "spell.targetType.self" },
            { value: "ally", label: "spell.targetType.ally" },
            { value: "enemy", label: "spell.targetType.enemy" },
            { value: "any", label: "spell.targetType.any" },
          ]}
          variant="underline"
          fullWidth
          onchange={(e) => onUpdate("targeting.targetType", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col" style="--dark: #3B82F6; --light: #DBEAFE">
      <div class="stat-header">{t("spell.maxTargets")}</div>
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
      <div class="stat-header">{t("spell.requiresLOS")}</div>
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
  <div class="section-header">{t("spell.uses.title")}</div>

  <StatsCard columns={2}>
    <div class="stat-col" style="--dark: #EC4899; --light: #FCE7F3">
      <div class="stat-header">{t("spell.usesPerRest")}</div>
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
      <div class="stat-header">{t("spell.usesPerEncounter")}</div>
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
      <div class="stat-header">{t("spell.channeled")}</div>
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
      <div class="stat-header">{t("spell.togglable")}</div>
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
