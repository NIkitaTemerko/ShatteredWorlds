<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { getUpdateConsumable } from "../utils/updateConsumable";
  import { Input, SelectInput } from "../../../shared/ui";
  import { DAMAGE_TYPES, SAVE_TYPES, StatsCard } from "../../../entities/consumable";
  import { t } from "../../../shared/i18n";

  interface Props {
    item: ShwItem;
  }

  let { item }: Props = $props();

  const updateConsumable = getUpdateConsumable(item);
</script>

{#if item.system.consumable.consumableType === "bomb" && item.system.consumable.damage !== undefined && item.system.consumable.save !== undefined}
  <StatsCard columns={3} borderColor="rgba(215, 38, 61, 0.5)">
    <div class="stat-col">
      <div class="stat-header">{t("item.bomb.damage")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.damage.amount}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("damage.amount", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.bomb.damageType")}</div>
      <div class="stat-body">
        <SelectInput
          value={item.system.consumable.damage.type}
          options={DAMAGE_TYPES}
          variant="underline"
          fullWidth
          onchange={(e) => updateConsumable("damage.type", e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.bomb.radius")}</div>
      <div class="stat-body">
        <Input
          type="number"
          min="0"
          value={item.system.consumable.radius}
          variant="underline"
          textAlign="center"
          fullWidth
          onchange={(e) => updateConsumable("radius", Number(e.currentTarget.value))}
        />
      </div>
    </div>

    <div class="stat-col">
      <div class="stat-header">{t("item.bomb.save")}</div>
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
      <div class="stat-header">{t("item.bomb.difficulty")}</div>
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
  </StatsCard>
{/if}
