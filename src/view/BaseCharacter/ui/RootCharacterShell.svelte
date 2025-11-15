<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { CharacterTab, AdditionalAttributes } from '../../../entities/character';
  import {
    CharacterHeader,
    AttributeStats,
    AdditionalStats,
  } from '../../../entities/character';
  import { TabNavigation } from '../../../features/navigation';
  import { RollPanel } from '../../../features/roll';

  interface Props {
    actor: ShwActor<'character'>;
  }

  let { actor }: Props = $props();

  let activeTab = $state<CharacterTab>('stats');

  function handleTabChange(tab: CharacterTab) {
    activeTab = tab;
  }

  function handleAdditionalStatsUpdate(key: keyof AdditionalAttributes, value: number) {
    actor.update({ [`system.additionalAttributes.${String(key)}`]: value });
  }
</script>

<CharacterHeader {actor} />

<TabNavigation {activeTab} onTabChange={handleTabChange} />

{#if activeTab === 'stats'}
  <section>
    <AttributeStats {actor} />
    <RollPanel {actor} />
  </section>
  <AdditionalStats stats={actor.system.additionalAttributes} helpers={actor.system.helpers} onUpdate={handleAdditionalStatsUpdate} />
{:else}
  <div>test</div>
{/if}
