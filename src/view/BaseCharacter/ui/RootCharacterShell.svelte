<script lang="ts">
  import type { ShwActor } from "../../../documents/Actor/ShwActor";
  import type { CharacterTab } from "../../../entities/character";
  import {
    AdditionalStats,
    AttributeStats,
    CharacterAbilities,
    CharacterHeader,
    CharacterInventory,
    CharacterSpells,
  } from "../../../entities/character";
  import { TabNavigation } from "../../../features/navigation";
  import { RollPanel } from "../../../features/roll";
  import type { AdditionalAttributes } from "../../../shared/model/types";

  interface Props {
    actor: ShwActor<"character">;
  }

  let { actor }: Props = $props();

  let activeTab = $state<CharacterTab>("stats");

  function handleTabChange(tab: CharacterTab) {
    activeTab = tab;
  }

  function handleAdditionalStatsUpdate(key: keyof AdditionalAttributes, value: number) {
    actor.update({ [`system.additionalAttributes.${String(key)}`]: value });
  }
</script>

<CharacterHeader {actor} />

<TabNavigation {activeTab} onTabChange={handleTabChange} />

{#if activeTab === "stats"}
  <section>
    <AttributeStats {actor} />
    <RollPanel {actor} />
  </section>
  <AdditionalStats
    stats={actor.system.additionalAttributes}
    helpers={actor.system.helpers}
    onUpdate={handleAdditionalStatsUpdate}
  />
{:else if activeTab === "inventory"}
  <CharacterInventory {actor} />
{:else if activeTab === "spells"}
  <CharacterSpells {actor} />
{:else if activeTab === "abilities"}
  <CharacterAbilities {actor} />
{:else}
  <div>test</div>
{/if}
