<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { getUpdateConsumable } from "../utils/updateConsumable";
  import { Input, SelectInput } from "../../../shared/ui";
  import { SAVE_TYPES, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
</script>

{#if item.system.consumableType === "scroll" && item.system?.spell !== undefined && item.system?.requirements !== undefined}
  <StatsCard columns={3}>
    <div class="stat-col">
      <div class="stat-header">{t("item.scroll.spellName")}</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.spell.name}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("spell.name", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.scroll.level")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          max="9"
          value={item.system.spell.level}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("spell.level", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.scroll.school")}</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.spell.school}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("spell.school", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.scroll.requiredAttribute")}</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.requirements.ability}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("requirements.ability", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.scroll.difficulty")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.requirements.dc}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("requirements.dc", Number(e.currentTarget.value))}
        />
      </div>
    </div>
  </StatsCard>
{/if}
