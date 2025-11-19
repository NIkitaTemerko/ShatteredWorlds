<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { getUpdateConsumable } from "../utils/updateConsumable";
  import { Input, SelectInput } from "../../../shared/ui";
  import { APPLICATION_TYPES, SAVE_TYPES, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
</script>

{#if item.system.consumable.consumableType === "poison" && item.system.consumable.damage !== undefined && item.system.consumable.save !== undefined}
  <StatsCard columns={3} borderColor="rgba(108, 117, 125, 0.5)">
    <div class="stat-col">
      <div class="stat-header">{t("item.poison.initialDamage")}</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.consumable.damage.initial}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("damage.initial", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.poison.repeatDamage")}</div>
      <div class="stat-body">
        <Input
          type="text"
          value={item.system.consumable.damage.recurring}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("damage.recurring", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.poison.duration")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="1"
          value={item.system.consumable.damage.duration}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("damage.duration", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.poison.save")}</div>
      <div class="stat-body">
        <SelectInput
          value={item.system.consumable.save.type}
          options={SAVE_TYPES}
          variant="underline"
          fullWidth
          onchange={(e) => updateConsumable("save.type", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.poison.difficulty")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.save.dc}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("save.dc", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col full">
      <div class="stat-col">
        <div class="stat-header">{t("item.poison.application")}</div>
        <div class="stat-body">
          <SelectInput
            bind:value={item.system.consumable.application}
            options={APPLICATION_TYPES}
            variant="underline"
            fullWidth
            onchange={(e) => updateConsumable("application", e.currentTarget.value, e)}
          />
        </div>
      </div>
    </div></StatsCard
  >
{/if}
