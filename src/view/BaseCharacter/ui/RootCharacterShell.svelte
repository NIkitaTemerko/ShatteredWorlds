<script lang="ts">
  import { untrack } from 'svelte';
  import { createSheetEvents } from './sheetEvents';
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import { t } from '../../../shared/i18n';
  import CharacterOverviewHeader from './CharacterOverviewHeader.svelte';
  import CharacterStats from './CharacterStats.svelte';
  import CharacterCollections from './CharacterCollections.svelte';
  import CharacterEditor from './CharacterEditor.svelte';
  import './character-sheet.css';
  export type SheetSection = 'stats' | 'inventory' | 'spells' | 'abilities';
  interface Props {
    actor: ShwActor<'character'> | ShwActor<'npc'>;
    initialTab?: SheetSection;
    initialEditing?: boolean;
  }
  let { actor, initialTab = 'stats', initialEditing = false }: Props = $props();
  const sheetEvents = createSheetEvents();
  let activeTab = $state<SheetSection>(untrack(() => initialTab));
  let editing = $state(untrack(() => initialEditing));
  function navigate(action: () => void) {
    if (
      sheetEvents.dispatchEvent(
        new CustomEvent('shw-character-navigate', { cancelable: true, detail: action }),
      )
    )
      action();
  }
  const tabs = ['stats', 'inventory', 'spells', 'abilities'] as const;
</script>

<div class="shw-character">
  <CharacterOverviewHeader {actor} {editing} onEdit={() => navigate(() => (editing = !editing))} />
  {#if editing}
    <CharacterEditor {actor} onClose={() => (editing = false)} />
  {:else}
    {#if actor.type === 'character'}
      <nav class="character-tabs" aria-label={t('newUi.sections')}>
        {#each tabs as tab}
          <button
            type="button"
            class:active={activeTab === tab}
            aria-current={activeTab === tab ? 'page' : undefined}
            onclick={() => navigate(() => (activeTab = tab))}>{t(`newUi.${tab}`)}</button
          >
        {/each}
      </nav>
    {/if}
    <main class="character-content">
      {#if actor.type === 'npc' || activeTab === 'stats'}
        <CharacterStats {actor} />
      {:else}
        {#key activeTab}<CharacterCollections {actor} section={activeTab} />{/key}
      {/if}
    </main>
  {/if}
</div>
